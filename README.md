# Instructions:

Write a program that will determine the type of a triangle. It should take the lengths of the triangle's three sides as input, and return whether the triangle is equilateral, isosceles or scalene.


We are looking for solutions that showcase problem solving skills and structural considerations that can be applied to larger and potentially more complex problem domains. Pay special attention to tests, readability of code and error cases.

# Description

The app I wrote takes three sides as inputs and returns whetehr the triangle is equilateral, isosceles or scalene. The app does a couple of additional things: it warns the user if the inputs aren't valid lengths; it warns if the lengths can't comprise a valid, flat, 2d triangle; and if the lengths do comprise a valid triangle, the app graphs the triangle and labels the coordinates of its vertices.

# Discussion:

I approached the project with a few design principles/goals/plans:

1. **Store no unnecessary state.** In my experience, state can both simplify and complicate, create problems and help solve them. For a program as small as this, saving state seemed unnecessary. So input values, error message content, success message content, triangle type or triangle diagram aren't stored anywhere. They're just computed and displayed.

1. **Write short and/or simple functions.** For the most part, all functions in the app are short. They do either one thing or two related, closely coupled things. I've never found any drawbacks to coding this way. It forces me to think carefully about the discrete tasks that my code is performing, and by separating concerns and functionality, it simplifies testing and debugging.

    The only longer functions are App.prototype.testAndDraw() and computeAndGraphTriangle(); they test input validity, compute the canvas/Cartesian coordinates of the triangle's vertices, and plot and label the triangle on the canvas element. Despite the lengths of these functions, they aren't exceptions to the rule of writing short, simple functions.

    The only complexity that they manage is the complexity of control flow. Nearly all of the more complicated logic and thinking -- the actual work and computation related to the functionality of the app -- are exported to the short functions that these longer functions call.

    The goal of writing the longer functions in this manner was to improve readability and maintainability and lower cognitive burden by separating different kinds of complexity: longer functions handle control flow; shorter function handle more complex logic/computation. So they're longer than other functions, but like the other functions they're also meant to be readable, simple and specialized.

1. **Keep classes small.** I try to treat React classes like interfaces and separate interface from implementation: whenever possible, nothing in the class should be longer than one line. The class declaration should descriptively name its member and, if I'm using TypeScript, label their types and/or indicate what arguments they take and what they return. JSX should never contain logic (again, separate concerns).

    The goal of writing classes this way is to reduce my own cognitive burden and make my code more readable and maintainable. The App class is as short as I think I could make it and should be easy for another developer to follow -- or at least easier to follow than it would be if I hadn't written it this way. Each of the two parts -- JSX and member declarations -- should fit on a single screen. A reader should be able to scan the code with ease, determine how each part is meant to fit into the whole, and jump to relevant function definitions as needed.

    About half-way through the project I started refactoring the code to add a custom Triangle class. But it was so small that it didn't justify the additional complexity/boilerplate.

1. UI-wise, my decision to use React hamstrung me more than I expected. I couldn't make some of the Tradeshift UI elements work. I'm guessing that that's because they're directly manipulating the DOM, preventing React from seeing them and correctly reconciling the changes. In the past, I've solved this kind of problem by putting the manipulated elements in state, but given the time constraints, I decided that that shouldn't be a priority.

    That means I had to strip out a few things (sidebar, tabs, notifications, error messages using Tradshift's components) and was left with a less designed, less pretty app than originally planned.

    I added the graph because, although the exercise didn't request it, the functionality seems to expect/benefit from it: if a user wants information about a triangle, wouldn't the user also want to know what it looks like?


1. **No magical constants. Do everything with functions and parameters.** I left out a number of things that I thought about adding: sliders to change side lengths, responsive design, a Cartesian grid that scales correctly, labels for each side, coordinate labels that are positioned more attractively/appropriately, animations morphing one triangle into another, a history of the user's past triangles, etc. But I also tried to write the app in a way that laid the necessary groundwork for those things. There are almost no magical constants in the app. Almost everything is programmatic and parameterized. In order to add some of the things I listed at the start of this paragraph, I wouldn't need to make large changes to the functions I wrote. For many of them I'd instead need to pass my existing functions different parameters and/or call them in different ways.
