# Advent of Code 2023 in React TypeScript!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run scaffold <day>`

Copies the `useDayX.tsx` template to create a new hook for the day you specify.
You'll still need to edit day.tsx to add it to the list of components which can be chosen.

Also copies the io template in `public/io/template` to make a new set of io files for the
day.
- .in.txt files are inputs
- .1.txt and .2.txt files are the expected outputs for part 1 and 2 respectively.

### `npm run download <day>`

Downloads the input for the day into `public/io/useDay<day>/input.in.txt`

Make sure .session has your session token from the advent of code website!
