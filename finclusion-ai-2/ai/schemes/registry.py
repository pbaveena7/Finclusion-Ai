from ai.schemes.schemas import SchemeMetadata

# In-Memory Database of Verified Indian Government Schemes
SCHEME_REGISTRY = [
    SchemeMetadata(
        scheme_id="ppf",
        name="Public Provident Fund (PPF)",
        purpose="Long-term tax-saving investment with sovereign guarantee.",
        min_age=0, max_age=100,
        min_contribution=500, max_contribution=150000,
        lock_in_period="15 years (partial withdrawal after 7th year)",
        tax_benefits="EEE (Exempt-Exempt-Exempt) under Sec 80C",
        official_source="https://www.indiapost.gov.in",
        last_verified="2023-10-01",
        goals_matched=["savings", "tax_saving", "child_education"]
    ),
    SchemeMetadata(
        scheme_id="nps",
        name="National Pension System (NPS)",
        purpose="Voluntary, market-linked retirement scheme.",
        min_age=18, max_age=70,
        min_contribution=1000, max_contribution=9999999,
        lock_in_period="Until age 60",
        tax_benefits="Up to ₹1.5L under 80C + exclusive ₹50k under 80CCD(1B)",
        official_source="https://www.npstrust.org.in",
        last_verified="2023-10-01",
        goals_matched=["retirement", "tax_saving"]
    ),
    SchemeMetadata(
        scheme_id="apy",
        name="Atal Pension Yojana (APY)",
        purpose="Guaranteed minimum pension for unorganized sector workers.",
        min_age=18, max_age=40,
        min_contribution=42, max_contribution=1454,
        lock_in_period="Until age 60",
        tax_benefits="Tax benefits under Sec 80CCD",
        official_source="https://www.npscra.nsdl.co.in/nsdl/scheme-details/apy.php",
        last_verified="2023-10-01",
        goals_matched=["retirement", "low_income"]
    ),
    SchemeMetadata(
        scheme_id="ssy",
        name="Sukanya Samriddhi Yojana (SSY)",
        purpose="Savings scheme targeted at parents of girl children.",
        min_age=0, max_age=10, # Age of the girl child
        gender_specific="female",
        min_contribution=250, max_contribution=150000,
        lock_in_period="21 years or until marriage after 18",
        tax_benefits="EEE (Exempt-Exempt-Exempt) under Sec 80C",
        official_source="https://www.indiapost.gov.in",
        last_verified="2023-10-01",
        goals_matched=["child_education", "child_marriage", "tax_saving"]
    ),
    SchemeMetadata(
        scheme_id="scss",
        name="Senior Citizen Savings Scheme (SCSS)",
        purpose="Regular income stream for senior citizens.",
        min_age=60, max_age=100,
        min_contribution=1000, max_contribution=3000000,
        lock_in_period="5 years",
        tax_benefits="Tax deduction under Sec 80C. Interest is taxable.",
        official_source="https://www.indiapost.gov.in",
        last_verified="2023-10-01",
        goals_matched=["retirement_income", "senior_citizen"]
    )
]
