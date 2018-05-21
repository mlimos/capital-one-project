# capital-one-project

### To Run Project
1. Install node.js if it is not already on your machine [https://nodejs.org/en/download/]
2. Once installed, clone or download a zip of this project onto your local machine
3. Navigate to the root folder of the project
4. Run the command **npm install** to install all dependencies
5. To run unit tests, run the command **npm test**. 14 unit tests will run
6. To run the application, run the command **npm start**.
7. Open Chrome or another browser and navigate to http://localhost:3000
8. The webpage will display

### Webpage description
* **Average Open/Close Pricing Graphs**
  * The top graph plots MSFT, GOOGL, and COF average open pricing data against each other, broken down by month.
  * The second graph plots MSFT, GOOGL, and COF average closing pricing data against each other, also broken down by month.
  * Hovering over a plotted point on each line will give you the precise average open/close price for that month.
  * Clicking on the ticker name in the legend will bold that ticker's plotted line in the graph.
* **Bottom Buttons**
  * Clicking on each button will display certain data related to the tickers. Clicking anywhere outside the modal that pops up will close the modal.
  * **Max Daily Profit:** Displays the maximum profit for each ticker between the dates of 1/1/2017 and 6/30/2017. Maximum profit is calculated as the day's high price - the day's low price. The date of the maximum profit is also displayed
  * **Busy Day:** Displays the average volume for each ticker between the days of 1/1/2017 - 6/30/2017. Also displays all 'busy days' in this time period. A busy day is defined as the day's volume being greater than or equal to 10% more than the average volume.
  * **Biggest Loser:** Displays the ticker that had the most days whose closing price was less than its opening price. This was also calculated between the days of 1/1/2017 - 6/30/2017
