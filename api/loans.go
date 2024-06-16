package api

import (
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type Loan struct {
	gorm.Model
	Amount        float64
	LoanInterest  float32
	StartDate     time.Time `gorm:"type:date"`
	DueDate       time.Time `gorm:"type:date"`
	Status        int       `gorm:"->"`
	CustomerID    uint
	Customer      Customer `gorm:"foreignKey:CustomerID;references:ID"`
	FinalAmount   float64  `gorm:"->"`
	TotalPayments float64  `gorm:"->"`
	Balance       float64  `gorm:"->"`
}

func CreateLoan(db *gorm.DB, loan *Loan) error {
	result := db.Create(loan)

	if result.Error != nil {
		return result.Error
	}

	fmt.Println("Creating loan successful")
	return nil
}

func GetLoans(db *gorm.DB) []Loan {
	var loans []Loan
	result := db.Preload("Customer").
		Joins("JOIN customers ON customers.id = loans.customer_id AND customers.deleted_at IS NULL").
		Select(`loans.*, COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0) AS final_amount, COALESCE(SUM(payments.amount), 0) AS total_payments, 
		COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) AS balance,
		CASE WHEN COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) = 0 THEN 2 ELSE 1 END AS status`).
		Joins("LEFT JOIN payments ON payments.loan_id = loans.id AND payments.deleted_at IS NULL").
		Group("loans.id").
		Order("status, loans.id DESC").
		Find(&loans)

	if result.Error != nil {
		fmt.Println("Get loans failed: ", result.Error)
	}

	return loans
}

func GetLoan(db *gorm.DB, id uint) []Loan {
	var loans []Loan
	result := db.Preload("Customer").
		Joins("JOIN customers ON customers.id = loans.customer_id AND customers.deleted_at IS NULL").
		Select(`loans.*, COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0) AS final_amount, COALESCE(SUM(payments.amount), 0) AS total_payments, 
		COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) AS balance,
		CASE WHEN COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) = 0 THEN 2 ELSE 1 END AS status`).
		Where("loans.id = ?", id).
		Joins("LEFT JOIN payments ON payments.loan_id = loans.id AND payments.deleted_at IS NULL").
		Group("loans.id").
		Order("status, loans.id DESC").
		Find(&loans)

	if result.Error != nil {
		fmt.Println("Get loans failed: ", result.Error)
	}

	for i := range loans {
		loans[i].FinalAmount = loans[i].Amount + (loans[i].Amount * (float64(loans[i].LoanInterest) / 100))
		loans[i].Balance = loans[i].FinalAmount - loans[i].TotalPayments
	}

	return loans
}

func SearchLoan(db *gorm.DB, loanIdCard string) ([]Loan, error) {
	var loans []Loan

	// Join the customers table with the loans table and filter by the id_card_number
	result := db.Preload("Customer").
		Joins("JOIN customers ON customers.id = loans.customer_id AND customers.deleted_at IS NULL").
		Select(`loans.*, COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0) AS final_amount, COALESCE(SUM(payments.amount), 0) AS total_payments, 
		COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) AS balance,
		CASE WHEN COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)) - SUM(payments.amount), COALESCE(loans.amount + (loans.amount * (loans.loan_interest / 100)), 0)) = 0 THEN 2 ELSE 1 END AS status`).
		Where("customers.id_card_number = ?", loanIdCard).
		Joins("LEFT JOIN payments ON payments.loan_id = loans.id AND payments.deleted_at IS NULL").
		Group("loans.id").
		Order("status, loans.id DESC").
		Find(&loans)

	if result.Error != nil {
		return loans, result.Error
	}

	for i := range loans {
		loans[i].Balance = loans[i].Amount + (loans[i].Amount * (float64(loans[i].LoanInterest) / 100)) - loans[i].TotalPayments
	}

	return loans, nil
}

func UpdateLoan(db *gorm.DB, loan *Loan) error {
	result := db.Model(&loan).Updates(loan)
	if result.Error != nil {
		log.Fatalf("Update loan failed: %v", result.Error)
		return result.Error
	}

	fmt.Println("Update loan successful")
	return nil
}

func DeleteLoan(db *gorm.DB, id int) error {
	var loan Loan
	result := db.Delete(&loan, id)

	if result.Error != nil {
		fmt.Println("Delete loan failed: ", result.Error)
		return result.Error
	}

	fmt.Println("Delete loan sucessful")
	return nil
}
