# Instructions:

Write a program that will determine the type of a triangle. It should take the lengths of the triangle's three sides as input, and return whether the triangle is equilateral, isosceles or scalene.


We are looking for solutions that showcase problem solving skills and structural considerations that can be applied to larger and potentially more complex problem domains. Pay special attention to tests, readability of code and error cases.

# Description

The app I wrote takes three sides as inputs and returns whether the triangle is equilateral, isosceles or scalene. The app does a couple of additional things: it warns the user if the inputs aren't valid lengths; it warns if the lengths can't form a valid, flat, 2d triangle; and if the lengths do comprise a valid triangle, the app graphs the triangle and labels the coordinates of its vertices.

# Discussion:

I approached the project with a few design principles/goals/plans:

1. **Store no unnecessary state.** In my experience, state can both simplify and complicate, create problems and help solve them. For a program as small as this, saving state seemed unnecessary. I decided not to store any of the following as state: input values, error message content, success message content, triangle type and triangle diagram. They're just computed and displayed.

1. **Write short, specialized and/or simple functions.** For the most part, all functions in the app are short. They do either one thing or two related, closely coupled things. I've never found any drawbacks to coding this way. It forces me to think carefully about the discrete tasks that my code is performing, and by separating concerns and functionality, it simplifies testing and debugging.

    The only longer functions are App.prototype.testAndDraw() and computeAndGraphTriangle(). Despite their lengths, they aren't exceptions to the rule of writing short, specialized, simple functions. They're both specialized: the only complexity that they manage is the complexity of control flow. Other logic and computation -- work related to the functionality of the app -- are exported to the short functions that these longer functions call.

    The goal of writing the long functions in this manner is to improve readability and maintainability and lower the cognitive demands of the code by separating different kinds of complexity. Shorter functions have barely any control flow; their specialty is calculation/computation/app-related functionality. Longer functions have only control flow; they do essentially no other work.

1. **Keep classes small.** I like to treat React classes like interfaces: I handle the class declaration separately from its implementation. Whenever possible, nothing in the class declaration should be longer than one line. All it should do is descriptively name its members and, if I'm using TypeScript, assign them types and/or indicate what types/arguments they take and what they return. JSX should never contain logic.

    The goal of writing classes this way is, again, to reduce cognitive demands and make code more readable and maintainable. My App class can be taken in and digested at a glance. The constructor and menber declarations all fit on a single page. So does the JSX. Ideally another developer should be able to scan my code and determine, with ease, how each part is meant to fit into the whole -- and then jump to relevant parts of the class if s/he needs to modify something.

    About half-way through the project I started refactoring the code to add a custom Triangle class. But the class was either too small to justify the additional complexity/boilerplate or became so large that it engulfed the entire app. That's not to say those sorts of custom classes couldn't be used well in this project/app. I just didn't have any obvious need/use for them.

1. UI-wise, my decision to use React hamstrung me more than I expected. I couldn't make some of the Tradeshift UI elements work. I'm guessing that that's because they're directly manipulating the DOM, preventing React from seeing them and correctly reconciling the changes. In the past, I think I've encountered and solved this kind of problem in a few different ways, but given the time constraints, I decided that that shouldn't be a priority.

    Unfortunately, that decision meant I had to strip out a few things (sidebar, tabs, notifications, error messages using Tradshift's components) and was left with a less designed, less pretty app than the one I'd originally planned.

    I added the graph because, although the exercise didn't request it, the functionality seems to expect/benefit from it: if a user wants any information about a polygon, wouldn't the user also want to know what it looks like?


1. **No magical constants. Do everything with functions and parameters.** Some of the things I thought about adding: 
      * Sliders to change side lengths
      * Animated transitions from one triangle shape to another
      * Responsive design
      * A Cartesian grid that scales with the lengths of the triangle's sides
      * Labels for each side, corresponding to the labels for each input, so that it's obvious what input matches what side
      * Position coordinate labels more attractively/appropriately, depending on the shape of the triangle.
      * A selectable history of the user's past triangles.
      * Draw/compute/classify different types of shapes
      
    I left those out, but I also tried to write the app in a way that laid the necessary groundwork for them. There are almost no magical constants in the app. Almost everything is programmatic and parameterized. In order to add some of the things listed above, I wouldn't even need to make large changes to the functions I wrote; I'd just need to pass them different parameters and call them in different ways/orders.


---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
