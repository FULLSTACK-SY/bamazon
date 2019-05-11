var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");


var wait = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SYindia1GO!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
    actionToTake();
});


function actionToTake() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
          displayItems();
        break;

        case "View Low Inventory":
          displayLowInventory();
        break;

        case "Add to Inventory":
          addInventory();
        break;

        case "Add New Product":
          addNewItems();
        break;

       case "Exit":
          connection.end();
        break;
      }
    });
}

async function displayItems()
    {
      var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
      connection.query(query, function(err, res) {

                // instantiate
                var table = new Table({
                  head: ['Item ID', 'Product', 'Price','Stock/Qty']
                , colWidths: [10, 100, 10, 15]
                });

                for (var i = 0; i < res.length; i++) {
                      table.push(
                        [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
                      );
                }
                // to display data in table format
                console.log(table.toString());

                if (i==res.length) {
                  actionToTake();
                  };
      });

    };

    async function displayLowInventory()
    {
      var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products where stock_quantity<5";
      connection.query(query, function(err, res) {

                // instantiate
                var table = new Table({
                  head: ['Item ID', 'Product', 'Department','Price','Stock/Qty < 5']
                , colWidths: [10, 100, 20, 10, 15]
                });

                for (var i = 0; i < res.length; i++) {
                      table.push(
                        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                      );
                }
                // to display data in table format

                console.log(table.toString());

                if (i==res.length) {
                  actionToTake();
                  };
      });

    };

 async function addInventory() {
      // query the database for all items being auctioned
      connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].item_id);
                }
                return choiceArray;
              },
              message: "Please select an ID of the Product you would like to add Inventory to :"
            },

            {
              name: "qty",
              type: "input",
              message: "How many units of this Product you would like to add to the existing stock :"
            }
          ])
          .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].item_id === answer.choice) {
                chosenItem = results[i];
              }
            }

            if (parseFloat(answer.qty)>0) {
                    var xAmt = (chosenItem.stock_quantity + parseFloat(answer.qty));

                    connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity: xAmt
                        },
                        {
                          item_id: chosenItem.item_id
                        }
                      ],
                      function(error) {
                        if (error) throw err;

                        console.log("Inventory is updated as per your request." );

                        setTimeout(displayItems, 3000);

                      }
                    );
            }
            else {
                  console.log("Incorrect Quantity! Try again ...");
                  displayItems();
            }
          });
      });
    }

  async function addNewItems() {

        inquirer
          .prompt([

              {
                name: "productName",
                type: "input",
                message: "New Product Name :"
              },
              {
                name: "departmentName",
                type: "input",
                message: "Department Name :"
              },
              {
                name: "price",
                type: "input",
                message: "Price per unit :"
              },
              {
                name: "qty",
                type: "input",
                message: "Stock/Qty :"
              }
          ])
          .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
              "INSERT INTO products SET ?",
              {
                product_name: answer.productName,
                department_name: answer.departmentName,
                price: answer.price,
                stock_quantity: answer.qty
              },
              function(err) {
                if (err) throw err;
                console.log("New product added successfully!");

                setTimeout(displayItems, 3000);
              }
            );
          });
    }
