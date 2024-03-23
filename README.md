# ToyShop readme
### Introduction
A comprehensive backend API for a toy shop E-commerce website with a user management system, carts, and order placements.

### Project Support Features

* Users can signup and signin to their accounts
* Public (non-authenticated) users can access all items available on the website
* Authenticated users can access their profile, cart and past orders as well as create a new order and edit the cart contents.
  
### Installation Guide
To run this project you will need nodeJS and npm installed on your machine first then:

* Clone the repo:

        git clone https://github.com/ZyadShokry/ToyShop.git

* Install the app's dependencies:

        npm install
* Create a .env file in your project root folder and add your MySQL and JWT variables.

### Usage
* Run npm app.js to start the server.
* Connect to the API using Postman on port 3001.

### API Endpoints
| HTTP Verbs | Endpoints | Action |

*| GET | /items | retrieves all items in the toyshop |
*| GET | /items/:item_id | view a certain item |
*| GET | /items/brand/:brand | view items from a certain brand |
*| GET | /items/search | performs a search in the items database table |

*| POST | /users/signup | To sign up a new user account |
*| POST | /users/signin | To login an existing user account |
*| GET | /users/view-orders | views the list of orders the user has made before |
*| GET | /users/view-orders/:order-id | views the details of a certain order |
*| GET | /users/user-profile | views the profile of the user |

*| GET | /cart | views the current cart of the user |
*| POST | /cart/add-item | adds an item to the cart |
*| DELETE | /cart/delete-item | deletes an item from the cart |
*| POST | /cart/update-quantity | updates the quatity of an item in the cart |
*| POST | /cart/place-order | places an order with the current cart contents |
*| DELETE | /cart/clear-cart | deletes all contents of the cart |


### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.



### License
This project is available for use under the MIT License.
