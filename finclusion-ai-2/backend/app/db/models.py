from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .session import Base

# ==========================================
# DOMAIN 1: USERS
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    knowledge_level = Column(String, default="beginner")
    risk_tolerance = Column(String, default="low")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships (Cascade Delete)
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    incomes = relationship("Income", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    loans = relationship("Loan", back_populates="user", cascade="all, delete-orphan")
    portfolio = relationship("Portfolio", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime)

    user = relationship("User", back_populates="goals")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    language = Column(String, default="en") # en, hi, ta
    notifications_enabled = Column(Boolean, default=True)
    currency = Column(String, default="INR")

    user = relationship("User", back_populates="preferences")


# ==========================================
# DOMAIN 2: FINANCE
# ==========================================

class Income(Base):
    __tablename__ = "incomes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    source = Column(String) # Salary, Business, Rental
    amount = Column(Float)
    frequency = Column(String, default="monthly")

    user = relationship("User", back_populates="incomes")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    category = Column(String) # Groceries, Rent, Utilities
    amount = Column(Float)
    is_essential = Column(Boolean, default=True)

    user = relationship("User", back_populates="expenses")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    loan_type = Column(String) # Home, Auto, Personal
    principal_remaining = Column(Float)
    interest_rate = Column(Float)

    user = relationship("User", back_populates="loans")
    emis = relationship("EMI", back_populates="loan", cascade="all, delete-orphan")


class EMI(Base):
    __tablename__ = "emis"

    id = Column(String, primary_key=True, index=True)
    loan_id = Column(String, ForeignKey("loans.id"))
    monthly_payment = Column(Float)
    remaining_tenure_months = Column(Integer)

    loan = relationship("Loan", back_populates="emis")


# ==========================================
# DOMAIN 3: INVESTMENTS
# ==========================================

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    total_value = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="portfolio")
    transactions = relationship("Transaction", back_populates="portfolio", cascade="all, delete-orphan")
    stocks = relationship("StockHolding", back_populates="portfolio", cascade="all, delete-orphan")
    mutual_funds = relationship("MutualFundHolding", back_populates="portfolio", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"))
    asset_type = Column(String) # Stock, Mutual Fund, Gold
    amount = Column(Float)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    transaction_type = Column(String) # BUY, SELL

    portfolio = relationship("Portfolio", back_populates="transactions")


class StockHolding(Base):
    __tablename__ = "stock_holdings"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"))
    ticker = Column(String)
    quantity = Column(Float)
    average_buy_price = Column(Float)

    portfolio = relationship("Portfolio", back_populates="stocks")


class MutualFundHolding(Base):
    __tablename__ = "mutual_fund_holdings"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"))
    fund_name = Column(String)
    units = Column(Float)
    nav_at_purchase = Column(Float)

    portfolio = relationship("Portfolio", back_populates="mutual_funds")
