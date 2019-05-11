# bamazon

## Overview

### Bamazon is like Amazon!
Two applications are created :

      Challenge #         Name                application Name
      _________________________________________________________
           1            Customer View        bamazonCustomer.js
           2            Manager View         bamazonManager.js


## npm Dependencies
mysql
inquirer
cli-table2


## Database and Table Creation
![Screenshot](structure.png)

also added dummy records (seeding) using csv file.
  ![Screenshot](csv.png)


## To make CLI project working
* Clone github repo using : git clone https://github.com/FULLSTACK-SY/bamazon.git
* From Bamazon folder run : npm install


## Logic :
### Customer View
##### COMMAND => node bamazonCustomer.js
* Application will first display all of the items available for sale.
* The app then will prompt the actions : 1. Buy a Product   2. Exit
##### OUTPUT =>
  ![Screenshot](custoptions.png)
##### CODE =>
  ![Screenshot](codecustoptions.png)

* If user selects to 'Buy a Product', the app will then prompt user for : 1. ID of the product they would like to buy   2.units
Once the customer has placed the order, checking if store has enough of the product to meet the customer's request.
    * If YES : showing the customer total cost of their purchase, with 7 seconds pause.
         then showing remaining store stock(updating table for te stock), prompting to 'Buy another product' or 'Exit'
    * If NO : displaying Insufficient quantity! and preventing the order from going through.
##### OUTPUT for YES =>
  ![Screenshot](buyoptions.png)
* After updating table-> display of remaining stock with options
  ![Screenshot](continuebuyoptions.png)
##### OUTPUT for NO =>
  ![Screenshot](nostock.png)
##### CODE =>
  ![Screenshot](codecustbuy.png)
