package api

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	IdCardNumber uint `gorm:"not null"`
	Name         string
	Address      string
	Tel          string
	Email        string
}

func CreateCustomer(db *gorm.DB, customer *Customer) (error, bool) {
	idCardCheck, err := GetCustomer(db, customer.IdCardNumber)
	if idCardCheck == nil {
		result := db.Create(customer)
		if result.Error != nil {
			log.Fatalf("Creating customer failed: %v", result.Error)
			return result.Error, false
		}
		fmt.Println("Creating customer successful")
		return nil, false
	} else {
		fmt.Println("Creating customer failed ID Card Number is already use")
		return err, true
	}
}

func GetCustomer(db *gorm.DB, cardId uint) (*Customer, error) {
	var customer Customer
	result := db.Where("id_card_number = ?", cardId).First(&customer)

	if result.Error != nil {
		return nil, result.Error
	}

	return &customer, nil
}

func UpdateCustomer(db *gorm.DB, customer *Customer) error {
	result := db.Model(&customer).Updates(customer)

	if result.Error != nil {
		log.Fatalf("Update customer failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Update customer sucessful")
	return nil
}

func DeleteCustomer(db *gorm.DB, id int) error {
	var customer Customer
	result := db.Delete(&customer, id)

	if result.Error != nil {
		log.Fatalf("Delete customer failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Delete customer sucessful")
	return nil
}

func SearchCustomer(db *gorm.DB, customerIdCard string) ([]Customer, error) {
	var customers []Customer
	result := db.Order("id").Where("id_card_number = ?", customerIdCard).Find(&customers)

	if result.Error != nil {
		log.Fatalf("Search customer failed: %v", result.Error)
		return customers, result.Error
	}

	return customers, nil
}

func GetCustomers(db *gorm.DB) []Customer {
	var customers []Customer
	result := db.Order("id").Find(&customers)

	if result.Error != nil {
		log.Fatalf("Get customer failed: %v", result.Error)
	}

	return customers
}
