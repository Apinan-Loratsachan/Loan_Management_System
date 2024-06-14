package main

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Name    string
	Address string
	Tel     string
	Email   string
}

func createCustomer(db *gorm.DB, customer *Customer) error {
	result := db.Create(customer)

	if result.Error != nil {
		log.Fatalf("Creating customer failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Creating customer successful")
	return nil
}

func getCustomer(db *gorm.DB, id int) *Customer {
	var customer Customer
	result := db.First(&customer, id)

	if result.Error != nil {
		log.Fatalf("Get customer failed: %v", result.Error)
	}

	return &customer
}

func updateCustomer(db *gorm.DB, customer *Customer) error {
	result := db.Model(&customer).Updates(customer)

	if result.Error != nil {
		log.Fatalf("Update customer failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Update customer sucessful")
	return nil
}

func deleteCustomer(db *gorm.DB, id int) error {
	var customer Customer
	result := db.Delete(&customer, id)

	if result.Error != nil {
		log.Fatalf("Delete customer failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Delete customer sucessful")
	return nil
}

func searchCustomer(db *gorm.DB, customerTel string) ([]Customer, error) {
	var customers []Customer
	result := db.Where("tel = ?", customerTel).Find(&customers)

	if result.Error != nil {
		log.Fatalf("Search customer failed: %v", result.Error)
		return customers, result.Error
	}

	return customers, nil
}

func getCustomers(db *gorm.DB) []Customer {
	var customers []Customer
	result := db.Order("id").Find(&customers)

	if result.Error != nil {
		log.Fatalf("Get customer failed: %v", result.Error)
	}

	return customers
}
