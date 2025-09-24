---
outline: [ 2, 4 ]
---

# Specifications: Decorator-based Dependency Injection

<table class="properties">
    <tbody>
        <tr>
            <th>Status</th>
            <td>testing</td>
        </tr>
        <tr>
            <th>Created</th>
            <td>2025-08-10</td>
        </tr>
        <tr>
            <th>Target</th>
            <td>TypeScript (ECMAScript decorators)</td>
        </tr>
    </tbody>
</table>

[[toc]]

## Problem Statement

While DI provides the mechanism to wire up dependencies, we still need a way create entire object graphs and execute the
application.

This specification document proposes the application lifecycle and composition model for building applications with CHO.

## Summary

- Introduce an application lifecycle with bootstrap and shutdown phases.
- Define an application root module as the entry point for configuring the DI context.
- Support module imports to compose larger applications from smaller modules.
- Provide lifecycle hooks for initialization and cleanup.
- Enable configuration and environment-specific overrides via modules.
- Ensure cross-runtime compatibility by avoiding runtime-specific features.

## Terminology

- **Endpoint** : The entry point of the application, e.g., an HTTP server, a CLI command, etc.
- **Controller** : A class that handles incoming requests or commands. A container for endpoints.
- **Module**: A class that provides a DI context. A container for providers and controllers (feature).
- **Middleware**: A function that intercepts process before reaching the endpoint handler.
- **Error Handler**: A function that handles errors thrown during endpoint processing.

## Building Blocks

This chapter relies on concepts defined in the [Dependency Injection](./di.md).

### Error Handling

Error handling is done via error handlers that can be registered at any level (module, controller, endpoint). Error
handlers are functions that take an error and the request context as arguments.

For an error handler requiring dependencies, it can be defined as an injectable class with a `catch` method, implementing
the `ChoErrorHandler` interface.

### Middleware

Middleware is used to intercept the request processing pipeline. Middleware can be registered at any level (module,
controller, endpoint). Middleware are functions that take the request context and a `next` function as arguments.

For a middleware requiring dependencies, it can be defined as an injectable class with a `handle` method, implementing
the `ChoMiddleware` interface.

### Module

The application specifications extends the use of modules as defined in the [Dependency Injection](./di.md) to
contain controllers, error handlers, and middleware.

A module is required to bootstrap the application. The root module is passed to the application bootstrap function.

### Controller

A controller is an injectable class annotated with the `@Controller` decorator. A controller can contain multiple
endpoints, error handlers, and middleware.

### Endpoint

An endpoint is an asynchronous method within a controller, annotated with decorators depending on the type of
application being built (e.g., `@Get`, `@Post` for web applications).


---

## Stages

The application lifecycle consists of the following stages:

#### Build Module Graph

The first stage of the application lifecycle is to build an abstract graph of modules and their dependencies by reading
the metadata set by the decorators.

#### Compilation

The next stage starts by bootstrapping a root module, which is an injectable class annotated with the `@Module`
decorator. The compiler searches for controllers and endpoints recursively in the module imports, resolving and
instantiating all dependencies. The result is a tree of resolved modules with their providers, dependencies,
controllers, and their endpoints bound and ready to be invoked.

The compilation stage is the first **initialization** phase of the application lifecycle. It is an async process and
ends when all dependencies are resolved and instantiated. Any setup task should be done in this phase.

The compilation stage is an asynchronous process.

#### Initialization

For more complex initialization tasks, the framework provides a lifecycle hook `onModuleInit` that can be implemented by
module classes. The method is called once all dependencies are resolved and instantiated, but before any endpoint is
invoked.

#### Linking

The linking stage is the process of binding the endpoints to their respective handlers, setting up middleware and error
handlers. This stage is specific to the type of application being built (e.g., web server, CLI app, etc.) and is
responsible for preparing the application to handle incoming requests or commands.

#### Activation

Another lifecycle hook `onModuleActivate` is provided for modules to activate any runtime-specific features, such as
starting a server, listening to events, etc. The method is called once the application is fully linked and ready to
handle requests or commands.

#### Running

Once the application is fully initialized and activated, it enters the running phase. In this phase, the application
handles incoming requests or commands, invoking the appropriate controllers and endpoints.

#### Shutdown

When the application is signaled to shut down (e.g., via a termination signal), it enters the shutdown phase. During
this phase, the application should clean up resources, close connections, and perform any necessary teardown tasks.
The lifecycle hook `onModuleShutdown` can be implemented by module classes to handle cleanup tasks.

---

## Implementation Details

### The Methods Decorators

Defined by the specific application type (e.g., web, CLI, etc.), these decorators are used to define endpoints within
controllers. Examples include `@Get`, `@Post` for web applications, or `@Command` for CLI applications.

The endpoint handler methods always get an application runtime context as the last argument.

```ts
class MyController {

    @Example()
    method(ctx: ExampleContext) {
        // endpoint logic
    }
}
```

More arguments can be defined by the user and resolved by the application at runtime.

### The `@Controller` Decorator

The `@Controller` decorator is used to define a controller class. Controllers are responsible for handling incoming
requests or commands and can contain multiple endpoints.

```ts

@Controller()
class MyController {

    @Example()
    method(ctx: ExampleContext) {
        // endpoint logic
    }
}
```

Since the controller is an injectable class, it can have dependencies that will be resolved by the DI system.

```ts

@Controller()
@Deps("dep1", "dep2")
class MyController {

    constructor(private dep1: Dep1, private dep2: Dep2) {
    }

    @Example()
    method(ctx: ExampleContext) {
        // endpoint logic
    }
}
```

### The `@Module` Decorator

The `@Module` decorator is used to define a module class. Modules are containers for providers, controllers, and provide
a DI context. The root module is the entry point of the application.

Module can implement lifecycle hooks by implementing the following interfaces: `OnModuleInit`, `OnModuleActivate`,
`OnModuleShutdown`.

```ts

@Module({
    controllers: [MyController],
    providers: [MyService],
    imports: [OtherModule],
})
class MyModule implements OnModuleInit {
    onModuleInit(): Promise<void> | void {
        // initialization logic
    }
}
```

### Middlewares

Middlewares are functions that accept a context and a `next` function to call the next middleware or the endpoint.

```ts
function myMiddleware(ctx: ExampleContext, next) {
    // pre-processing logic
    await next();
    // post-processing logic
}
```

For middlewares that require dependencies, they can be defined as injectable classes implementing the `ChoMiddleware`.

```ts

@Deps("dep1")
class MyMiddleware implements ChoMiddleware {
    constructor(private dep1: Dep1) {
    }

    async handle(ctx: ExampleContext, next: () => Promise<void>): Promise<void> {
        // pre-processing logic
        await next();
        // post-processing logic
    }
}
```

### Error Handling

Error handlers are functions that accept an error and the context as arguments.

```ts
function myErrorHandler(err: Error, ctx: ExampleContext) {
    // error handling logic
}
```

For error handlers that require dependencies, they can be defined as injectable classes implementing the
`ChoErrorHandler`.

```ts

@Deps("dep1")
class MyErrorHandler implements ChoErrorHandler {
    constructor(private dep1: Dep1) {
    }

    async catch(err: Error, ctx: ExampleContext): Promise<void> {
        // error handling logic
    }
}
```