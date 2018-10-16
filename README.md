# Instructions:

Write a program that will determine the type of a triangle. It should take the lengths of the triangle's three sides as input, and return whether the triangle is equilateral, isosceles or scalene.


We are looking for solutions that showcase problem solving skills and structural considerations that can be applied to larger and potentially more complex problem domains. Pay special attention to tests, readability of code and error cases.

# Discussion:

I approached the project with a few design principles/goals/plans:

1. **Store no unnecessary state.** State can simplify and complicate coding; it can create problems and help solve them. For a program as small as this, there didn't seem to be any point in saving state.

1. **Write short, simple functions.** For the most part, all functions in the app are very short. They do either one thing or two related, closely coupled things. I've never found any drawback to coding this way. It forces me to think more carefully about the discrete tasks that my code is performing, and by separating concerns and functionality, it makes testing and debugging much, much easier.

    The only longer functions are the functions that test the inputs, compute the canvas/Cartesian coordinates of the triangle's vertices, and draw and label the triangle in the canvas element. These are App.prototype.testAndDraw() and computeAndGraphTriangle(). If they're exceptions to the pattern of writing short, simple functions, they're exceptions that prove/uphold the rule.

    The only complexity that these longer functions manage is the complexity of control flow. Nearly all of the more complicated logic and thinking -- the actual work and computation -- are exported to the functions that these longer functions call. The goal of writing the functions this way was to improve readability and maintainability and lower cognitive burden by separating those different kinds of complexity: longer functions handle control flow; shorter function handle more complex logic/computation. So they're longest functions in the app, but they're also simple and specialized, like the app's other functions.

1. **Keep classes small.** Separate definition and implementation. I like to treat React classes like interfaces: everything should be one line long, indicating just the name of member and, if I'm using TypeScript, what parameters it takes and what it returns. The goal of writing classes this way is to reduce my own cognitive burden and make my code more readable and maintainable. The class is as short as I can make it and should be easy to follow -- or at least easier to follow than it would be if I hadn't written it this way. The JSX and member declarations/definitions each should fit on a single screen, making it easy for the reader to scan the code and determine how each part is meant to fit into the whole.

    About half-way through the project I started refactoring the code to add a custom Triangle class. But it was so small that it didn't justify the additional complexity/boilerplate.

1. UI-wise, my decision to use React hamstrung me more than I expected. I couldn't make some of the Tradeshift UI elements work. I'm guessing that that's because they're directly manipulating the DOM, preventing React from seeing them and correctly reconciling the changes. In the past, I've solved this kind of problem by putting the manipulated elements in state, but given the time constraints, I decided that that shouldn't be a priority.

    So I stripped out a few things (sidebar, tabs, notifications, error messages using Tradshift's components) and was left with a less designed, less pretty app than originally planned. I added the graph because, although the exercise didn't request it, the functionality seems to expect/benefit from it: if the user wants information about a triangle, wouldn't the user also want to know what it looks like?


1. **No magical constants. Do everything with functions and parameters.** I left out a number of things that I thought about adding: sliders to change side lengths, responsive design, a Cartesian grid that scales correctly, labels for each side, coordinate labels that are positioned more attractively/appropriately, animations morphing one triangle into another, a history of the user's past triangles, etc. But I also tried to write the app in a way that laid the necessary groundwork for them. There are almost no magical constants in the app. Almost everything is programmatic. In order to add some of the things I listed at the start of this paragraph, I wouldn't need to make large changes to the functions I wrote. For many of them I'd just need to my existing functions them different parameters and call them in different ways.

---


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
