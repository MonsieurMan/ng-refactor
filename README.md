<img src="https://ibb.co/evkKnJ" align="right"></img>

# NG Refactor  
> Bring joy to your angular vscode experience.  

![screengif](https://image.ibb.co/it8GEo/demo.gif)
## Table of contents

<!-- toc -->

- [Goals](#goals)
- [Features](#features)
  * [Toggle inline HTML](#toggle-inline-html)
  * [Toggle inline CSS](#toggle-inline-css)
    + [Known limitations](#known-limitations)
  * [~~Rename component~~ _(todo)_](#rename-component-_todo_)
  * [~~Move component~~ _(todo)_](#move-component-_todo_)
  * [~~Extract component from current selection~~ _(todo)_](#extract-component-from-current-selection-_todo_)
  * [~~Ng generate explorer integrations~~ _(todo)_](#ng-generate-explorer-integrations-_todo_)
- [Contributing](#contributing)
  * [Hacking on NG Refactor](#hacking-on-ng-refactor)

<!-- tocstop -->

## Goals
I have struggled way too many hours refactoring components by hand, it's enough and I thought this could make a few of you guys happier developpers.

## Features  
### Toggle inline HTML
Allow to toggle between inline template and external template file. 

_Available as :_
- Command in component typescript file  
  - <kbd>CTRL+SHIFT P</kbd> *Toggle inline HTML*
- Code action on `template:` or `templateUrl:`

### Toggle inline CSS
Allow to toggle between inline styles and external style sheet. 

_Available as :_
- Command when in component typescript file 
  - <kbd>CTRL+SHIFT P</kbd> *Toggle inline CSS*
- Code action on `styles:` or `styleUrls:`

#### Known limitations
As of know this doesn't take into account your configuration and will create and try to read from `scss` files.  
This is planned for a future release.

### ~~Rename component~~ _(todo)_
Allow to rename a component and its usage.

### ~~Move component~~ _(todo)_
Allow to move a component from one folder to another.

### ~~Extract component from current selection~~ _(todo)_  
Allow to create a new component from the current html selection.

### ~~Ng generate explorer integrations~~ _(todo)_  
Allow you to call `ng generate` via the explorer.

## Contributing  
Don't hesitate to file an [issue](https://github.com/MonsieurMan/ng-refactor/issues/new) if you found a bug or want to see a feature implemented !  
[Pull requests](https://github.com/MonsieurMan/ng-refactor/compare) are welcome too !

### Hacking on NG Refactor
NG refactor is developped in typescript and uses jest for testing, it has currently no dependencies.  
Run the following command in a terminal to install and launch:
```shell
git clone https://github.com/MonsieurMan/ng-refactor.git
cd ng-refactor
yarn | npm i
# Launch typescript compiler in watch mode
yarn start | npm run start
```
Once the typescript compiler is watching, simply press <kbd>F5</kbd> to open the **Extension Development Host** and you're good to go.  
If you're new to extension in vscode _~~as I am~~_ check out the _~~horrible~~_ [documentation](https://code.visualstudio.com/docs/extensions/overview)