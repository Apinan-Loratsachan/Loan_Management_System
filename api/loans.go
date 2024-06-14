package api

import (
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type Loan struct {
	gorm.Model
	Amount       string
	LoanInterest string
	StartDate    time.Time
	DueDate      time.Time
	CustomerID   uint
	Customer     Customer `gorm:"foreignKey:CustomerID;references:ID"`
}

func CreateLoan(db *gorm.DB, loan *Loan) error {
	result := db.Create(loan)

	if result.Error != nil {
		log.Fatalf("Creating loan failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Creating loan successful")
	return nil
}

func GetLoans(db *gorm.DB) []Loan {
	var loans []Loan
	result := db.Preload("Customer").Order("id").Find(&loans)

	if result.Error != nil {
		log.Fatalf("Get loans failed: %v", result.Error)
	}

	return loans
}
