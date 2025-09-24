---


---

# Command Line Applications

## Installation

Add the required packages to your project using your preferred package manager:

::: code-group

```shell [deno]
deno add jsr:@chojs/core jsr:@chojs/command
```

```shell [npm]
npx jsr add @chojs/core @chojs/command
```

```shell [yarn]
yarn add jsr:@chojs/core @chojs/command
```

```shell [pnpm]
pnpm i jsr:@chojs/core @chojs/command
```

```shell [bun]
bunx jsr add @chojs/core @chojs/command
```

:::

## First Command

Let's create a simple command line application that greets the user. We will define a controller with a main command
that prints "Hello, World!" to the console.

```ts
// my-controller.ts
import {Controller} from "@chojs/core";
import {Main} from "@chojs/command";

@Controller()
class MyController {
    
    @Main() //^ application main entry^left,1em,-.5em
    main() {
        console.log("Hello, World!");
    }
}
```

The `@Main()` decorator marks the `main` method as the entry point of the command line application.

## First Module

Next, we need to create a module to register our controller. The module serves as the root context for our application.

```ts
// app-module.ts
import {Module} from "@chojs/core";
import {MyController} from "./my-controller";

@Module({
    controllers: [MyController],
})
class AppModule {
}
```

## Running the Application

Finally, we need to bootstrap our application using the `Application` class from the `@chojs/command` package.

```ts
// main.ts
import {Application} from "@chojs/command";
import {AppModule} from "./app-module";

const app = await Application.create(AppModule);
```

The last part is runtime dependent. Here are examples for Deno, Node.js, and Bun.

::: code-group

```ts [deno]
// Deno
await app.run(Deno.args);
```

```ts [node]
// Node.js
await app.run(process.argv.slice(2));
```

```ts [bun]
// Bun
await app.run(Bun.argv.slice(2));
```

:::

Congratulations! You have created your first command line application using ChoJS. You can now extend your application
by adding more commands and features as needed.

Continue to the next section to learn more about defining commands and handling input arguments:

[Defining Commands and Input Arguments](cmd-02-defining-commands.md)