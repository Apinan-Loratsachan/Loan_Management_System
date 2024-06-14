package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strconv"
	"time"

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

	db.AutoMigrate(&Customer{})
	fmt.Println("Migrate database successful")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5500", // Adjust this to your frontend's origin
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	app.Get("/customers", func(c *fiber.Ctx) error {
		return c.JSON(getCustomers(db))
	})

	app.Get("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(getCustomer(db, id))
	})

	app.Post("/customers", func(c *fiber.Ctx) error {
		customer := new(Customer)
		if err := c.BodyParser(customer); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		err := createCustomer(db, customer)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(fiber.Map{
			"message": "Create customer sucessful",
		})
	})

	app.Put("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		customer := new(Customer)
		if err := c.BodyParser(customer); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}

		customer.ID = uint(id)

		err = updateCustomer(db, customer)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(fiber.Map{
			"message": "Update customer " + c.Params("id") + " sucessful",
		})
	})

	app.Delete("/customers/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		err = deleteCustomer(db, id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(fiber.Map{
			"message": "Delete customer " + c.Params("id") + " sucessful",
		})
	})

	app.Get("/customers/search/:tel", func(c *fiber.Ctx) error {
		tel, _ := url.QueryUnescape(c.Params("tel"))
		result, err := searchCustomer(db, tel)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString(err.Error())
		}
		return c.JSON(result)
	})

	app.Listen(":8080")
}
