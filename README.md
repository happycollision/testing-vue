# Learning Vue via a constrained project

- Serve with `npm run serve`
- Build with `npm run build`
- Test with `npm run test`
- Deploy (requires push to Github) with `sh deploy`

My final component: [`src/components/DataTable.vue`](src/components/DataTable.vue)

## Introduction

I undertook this project as part of a job application process. Though "learning Vue" was not a requirement of the job I was interested in, the spec for the task did present "use Vue.js" as possible "bonus points". Since there was no time limit on the project, I decided that it would be a great way to get acquainted with Vue for the first time.

## Approach

I started with a generic, `vue new` project. Since I am really enjoying Typescript these days (and in theory it helps when learning a new set of tools since some of the documentation is built right in), I chose that for this project as well. The Vue CLI really shines here, allowing me to use TS right from the start. Though I do believe that some buggy issues I was dealing with from time to time may have been due to this perhaps non-traditional approach. No matter. It sped me up more than it slowed me down.

From the start, I knew that I wanted to deploy simply to Github Pages. That meant that there would be no back end to speak of. The data needs for this project don't really require that anyway. I decided (since I was given CSV data to start with) that I would just keep everything in memory, based off of that file.

The first thing I did was add the CSV string to a TS file in my project. Then it was easy enough to manipulate the data. I didn't pull in any special packages to get this done. If the data had been more complex or if I thought that this was going to get deployed as-is, I would have asked a bit more about the needs for the data. I just turned it into something usable (and editable) myself. Those functions can be found in `/src/utils/csv-conversion.ts`. Since they aren't the focus of this project, I decided that "just enough" would be plenty.

The DataTable component itself takes a "data down, actions up" approach to the manipulation. The data is displayed as is and any mutation is actually handled elsewhere via catching the component's `$emit` calls. This keeps the component a little more generic. However, this component should not be considered all that generic (see the ["Should be more generic"](#should-be-more-generic) section of the Retrospective below for the reason why).

Styling inside the component is *mostly* handled through functional CSS provided by Tailwind.css. It is a fantastic project and has helped me immensely in all of my prototyping projects lately. This does not demonstrate my knowledge of CSS files directly, but you cannot really use a functional CSS approach without knowing what styles the classes invoke anyway. This is a tradeoff I was willing to make, and I doubt would put my knowledge of CSS in question.

However, I did use a **brand new css property** that I didn't know existed for this project. That actually was added to the bottom of the DataTable component as a style rule: `text-overflow: ellipsis`. I didn't know this existed before this project, and it allowed me to give a little extra room for more important elements in the table. (I assumed for this project that the ID field is not important information for a theoretical end user.)

## Retrospective

### Main problem: Time commitment

This project had no time limit, however, my life still needed to go on during it! I did everything for this project in two evenings and then one day off. That seems like an awful lot of time for a somewhat simple component, but I was learning Vue at the same time. I knew that completing this project in a framework I had no experience with would slow me down quite a lot. Building in Ember, React, or Angular (all of which I am far more experienced with) would have cut this project down to probably one evening.

I am happy with the tradeoff, though, because it is important for me to know a bit about Vue as a developer. The downside is that I finally have to simply call it quits today. There is more I would do to add some fit and finish to the whole thing if I was working in another framework, but I cannot devote any more time to this project.

Obviously, if my place of employment actually used Vue, I could easily justify spending more time learning about it. As it stands, I have learned what I need to consider myself *familiar* with Vue and some of its conventions.

### Next steps (or what I'd change if I had more time)

Perhaps I'll come back to this project in the future for more learning about Vue. If I did, here is what I'd likely explore.

#### Vuex

If I had more time, I would probably move the data side of things from the `App.vue` component into a proper Vuex store. I know that people love that Vue comes with a data management solution baked it. I just didn't have time to learn and use it.

#### Interface selection conventions

One of the things I don't love about the component as it stands is that you cannot shift-click or command/control-click on rows to select multiple rows at once. My current solution is that any click on a row (aside from the description field) either adds or removes that row from the current selection.

This, I am sure, would not be a time consuming addition to make, but you have to ship an MVP sometime. The "select all" box at the top left of the component goes a long way to alleviate some of the problems the interface has with selection, as is.

#### Responsive design

Though all the necessary data is viewable, and all actions are still available at smaller sizes, the *look* of the UI at smaller sizes leaves a lot to be desired. This comes down to, as always, time. I know how to go about working with the css to change things, but I don't currently have the time to do so.

#### Functional CSS -> BEM

As I mentioned earlier, the Tailwind css library is very helpful for prototyping (and often for end products). However, if this were to actually ship as a standalone component, I'd need to rethink the way I am applying styles to allow others to easily override (or even not include) the styles I am using at all.

This would mean going through the component and doing the dreaded: naming things. I'd have to actually give class names to many pieces of this component. I suppose that I'd ultimately use a BEM approach to that. But that would depend on just how generic this thing needed to be. For example, if it was going to be used internally on a project that already uses SASS for example, I'd probably just create a mixin that pops out some styles based on a few key inputs.

#### Undo/Cancel

When you are first using the interface, you may accidentally make a change you did not intend. This is because there is no way to revert changes you have made to a text field after you have made them. So if you highlight some description, then press any character key, your description will be replaced with that keystroke. There is currently no way to get the old text back.

If I had more time, the first thing I'd do is allow the escape button to deselect the current field without committing the changes that have been typed. (I know this would be trivially quick to add right now, but I am calling this my MVP as I said before.)

Then I'd add a button next to the field that can cancel an edit as well.

Right after that, I'd think about adding an undo button or some other way of undoing. However, depending on the application that this component would be used inside, undo may already be implemented there, so any actions taken here would be trivial to undo anyway. So I'd want to make the undo system opt-in.

#### Multiple edit interface

Currently, editing multiple descriptions at once is not presented in the most ideal way. There are little hints that the action you are taking will affect more than just the field you are in, but it is not as good as it could be. Perhaps hiding all non-selected fields when editing, and showing the edits propagate across all the fields in real time would be better.

Ultimately, allowing the user to enter a multi-edit mode where there are many strategies for editing multiple selections would be good. Should we *append* to all? Should we *replace* all? Etc.

#### Expanded Filtering

The search field (which actually acts as a filter) could be expanded in the future to target certain fields specifically. It could also allow more advanced queries (such as "before date" and "after date").

#### Should be more generic

The project I was building this component for had specific requirements. My limited understanding of Vue caused me to address some of those requirements early on in a way that I would not have done at the end of the project, when I had a better understanding of Vue. This led to some mixing of concerns.

Parts of the component are fairly generic. For example: the component itself used to do the CSV conversion, but now, it just expects the data in a way that makes sense for tables. This means that a consumer can simply shape the data in JS and feed it to the component.

Other things, however would fall apart if the component did not get the exact data being passed in. For example, I chose to treat the ID column differently than the other columns in the data set. This decision should not be made at the component level. Instead I should expose the *option* to display certain fields in certain ways.

Additionally, It would be nice to allow a consumer to pass in options and functions related to search/filtering and formatting with each column. Numbers are automatically displayed as red if they are negative, for example. But you may not want that everywhere. It would be best to override that if needed.

## Final thoughts

Vue is a nice project and it seems to fill in the space between React (simply a component library) and Ember or Angular (full frameworks). I didn't get a chance to use more of the framework-type corners of Vue (the router, data management, etc), but I think I got a good feel for the component conventions they use.

However, something struck me as interesting: The documentation for Vue, while fairly extensive, leaves a little to be desired. Ha! What a funny thing to say. All documentation leaves something to be desired from the person who can't find a particular bit of information. Vue's documentation is actually quite good on the whole.

Specifically, it seems there are multiple ways to declare things like props and data on a component, and I felt a little left in the dark about it. The CLI generated an `App` component and a `HelloWorld` component that each seemed to do things differently. That is fine, but the documentation seems to explain everything in terms of an object passed into the constructor for a class, whereas the `HelloWorld` component (which I subsequently renamed to DataTable and did most of my work) seemed to define things directly inside a true class definition.

I do not know enough about Vue yet to understand where it shines versus the other libraries/frameworks I use more regularly, but it is quite nice and I'll be interested to see what the Vue team continues to do in the future.

---------

The rest below was generated by Vue's CLI.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
