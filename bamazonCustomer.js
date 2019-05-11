var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");
var colors = require("colors");

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
    displayItems();
});



async function displayItems()
    {
      var query = "SELECT item_id, product_name, department_name,price,stock_quantity FROM products";
      connection.query(query, function(err, res) {

                // instantiate
                var table = new Table({
                  head: ['Item ID', 'Product', 'Department','Price','Stock/Qty']
                , colWidths: [10, 100, 20, 10, 15]
                });

                for (var i = 0; i < res.length; i++) {
                      // traditional way to display data, not using.
                      // console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price+ " || Stock Qty: " + res[i].stock_quantity);
                      // table is an Array, so you can `push`, `unshift`, `splice` and friends
                      table.push(
                        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                      );
                }
                // to display data in table format
                console.log(table.toString());

                if (i=res.length) {
                  actionToTake();
                  };
      });

    };


 function actionToTake() {
      inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: [
            "Buy a Product",
            "exit"
          ]
        })
        .then(function(answer) {
          switch (answer.action) {
          case "Buy a Product":
            buyItem();
            break;

          case "exit":
            connection.end();
            break;
          }
        });
    }




 async function buyItem() {
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
              message: "Please select an ID of the Product you would like to buy :"
            },

            {
              name: "qty",
              type: "input",
              message: "How many units of this Product you would like to buy :"
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

            if (chosenItem.stock_quantity >= parseFloat(answer.qty)) {
                    var x = (chosenItem.stock_quantity - parseFloat(answer.qty));
                    var payAmt = (parseFloat(answer.qty) * chosenItem.price);

                    connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity: x
                        },
                        {
                          item_id: chosenItem.item_id
                        }
                      ],
                      function(error) {
                        if (error) throw err;

                        console.log("Your order is ready, please pay total : $" + payAmt  );

                        setTimeout(displayItems, 7000);

                      }
                    );
            }
            else {
                  console.log("Insufficient Quantity! Try again ...");
                  actionToTake();
            }
          });
      });
    }
