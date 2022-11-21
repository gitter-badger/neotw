#!/usr/bin/env zx

// enable quiet mode
$.verbose = false;

import prompts from "prompts";
import { spinner } from "zx/experimental";
import { cyan, blue, yellow, bold, dim, green } from "kolorist";
import { info, finish } from "./info.mjs";

info();

const bin = "tiddlywiki";
const questions = [
  {
    type: "select",
    name: "output",
    message: "output dir",
    choices: [
      {
        title: "Vanilla",
        description: "default",
        value: "output",
      },
      { title: "Custom", description: "custom", value: "custom" },
    ],
    initial: 0,
  },
  {
    type: (prev) => (prev == "custom" ? "text" : null),
    name: "output",
    message: "custom output",
  },
  {
    type: "select",
    name: "setup",
    message: "Are you sure to set passwd ?",
    choices: [
      {
        title: "yes",
        description: "set TiddlyWiki password",
        value: "yes",
      },
      { title: "no", value: "no" },
    ],
    initial: 1,
  },
  {
    type: (prev) => (prev == "yes" ? "password" : null),
    name: "password",
    message: "custom password",
  },
  {
    type: "toggle",
    name: "isBuild",
    message: "Are you sure to build ?",
    initial: true,
    inactive: "no",
    active: "yes",
  },
];

const response = await prompts(questions);
const output = response.output;
const setup = response.setup;
const passwd = response.password;

if (response.isBuild) {
  await spinner("Building ...", async () => {
    await $`rm -rf ${output}`; // clean
    if (setup) {
      await $`npx ${bin} --output ${output} --password ${passwd} --build index `; // use vanilla replace --build
    } else {
      await $`npx ${bin} --output ${output} --build index`; // use vanilla replace --build
    }
  });
  finish();
}
