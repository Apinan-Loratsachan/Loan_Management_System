package api

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Amount float64
	Date   time.Time `gorm:"type:date"`
	LoanID uint
	Loan   Loan `gorm:"foreignKey:LoanID;references:ID"`
}

func CreatePayment(db *gorm.DB, payment *Payment) error {
	result := db.Create(payment)

	if result.Error != nil {
		return result.Error
	}

	fmt.Println("Creating payment successful")
	return nil
}

func GetPayments(db *gorm.DB) ([]Payment, error) {
	var payments []Payment
	err := db.Preload("Loan.Customer").
		Joins("JOIN loans ON loans.id = payments.loan_id AND loans.deleted_at IS NULL").
		Joins("JOIN customers ON customers.id = loans.customer_id AND customers.deleted_at IS NULL").
		Order("payments.id desc").
		Find(&payments).Error
	if err != nil {
		return nil, err
	}
	return payments, nil
}

func SearchPayments(db *gorm.DB, loanId uint) ([]Payment, error) {
	var payments []Payment
	err := db.Preload("Loan.Customer").
		Joins("JOIN loans ON loans.id = payments.loan_id AND loans.deleted_at IS NULL").
		Joins("JOIN customers ON customers.id = loans.customer_id AND customers.deleted_at IS NULL").
		Where("payments.loan_id = ?", loanId).
		Order("payments.id desc").
		Find(&payments).Error
	if err != nil {
		return nil, err
	}
	return payments, nil
}

func DeletePayment(db *gorm.DB, id uint) error {
	var payment Payment
	result := db.Delete(&payment, id)

	if result.Error != nil {
		fmt.Println("Delete payment failed: ", result.Error)
		return result.Error
	}

	fmt.Println("Delete payment sucessful")
	return nil
}
