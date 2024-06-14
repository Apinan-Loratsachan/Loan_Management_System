package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/apinan-loratsachan/fiber-postgresql-gorm/api"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	host     = "localhost"              // or the Docker service name if running in another container
	port     = 5432                     // default PostgreSQL port
	user     = "admin"                  // as defined in docker-compose.yml
	password = "password"               // as defined in docker-compose.yml
	dbname   = "loan_management_system" // as defined in docker-compose.yml
)

func main() {
	dsn := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      true,        // Enable color
		},
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		panic("Failed to connect database")
	} else {
		fmt.Println("Connect database successful")
	}

	db.AutoMigrate(&api.Customer{}, &api.Loan{})
	fmt.Println("Migrate database successful")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5500", // Adjust this to your frontend's origin
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	// Customers API
	app.Get("/customers", func(c *fiber.Ctx) error {
		return c.JSON(api.GetCustomers(db))
	})

	app.Get("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		cardId := uint(id)
		result, err := api.GetCustomer(db, cardId)
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString(err.Error())
		}
		return c.JSON(result)
	})

	app.Post("/customers", func(c *fiber.Ctx) error {
		customer := new(api.Customer)
		if err := c.BodyParser(customer); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		err, alreadyUse := api.CreateCustomer(db, customer)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		} else if alreadyUse {
			return c.JSON(fiber.Map{
				"success": false,
				"message": "Creating customer failed ID Card Number is already use",
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Create customer sucessful",
		})
	})

	app.Put("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		customer := new(api.Customer)
		if err := c.BodyParser(customer); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}

		customer.ID = uint(id)

		err, alreadyUse := api.UpdateCustomer(db, customer)
		if err != nil {
			if err.Error() == "ID Card Number is already used by another customer" {
				return c.JSON(fiber.Map{
					"success": false,
					"message": err.Error(),
				})
			}
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		} else if alreadyUse {
			return c.JSON(fiber.Map{
				"success": false,
				"message": "Update customer failed ID Card Number is already use",
			})
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Update customer " + c.Params("id") + " sucessful",
		})
	})

	app.Delete("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		err = api.DeleteCustomer(db, id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(fiber.Map{
			"message": "Delete customer " + c.Params("id") + " sucessful",
		})
	})

	app.Get("/customers/search/:id_card_number", func(c *fiber.Ctx) error {
		id_card_number, _ := url.QueryUnescape(c.Params("id_card_number"))
		result, err := api.SearchCustomer(db, id_card_number)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(result)
	})

	// Loans API
	app.Get("/loans", func(c *fiber.Ctx) error {
		return c.JSON(api.GetLoans(db))
	})

	app.Post("/loans", func(c *fiber.Ctx) error {
		loan := new(api.Loan)
		if err := c.BodyParser(loan); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		err := api.CreateLoan(db, loan)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(fiber.Map{
			"message": "Create loan sucessful",
		})
	})

	app.Listen(":8080")
}
