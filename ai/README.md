# Clinical Trial Report Anomaly Detection

This project contains scripts to train an anomaly detection model on clinical trial data and predict anomalies in new reports.

## Project Structure

```
.
├── archive/                  # Directory containing raw CSV data (patients, encounters, etc.)
├── frontend_options.json     # JSON file with unique values for frontend dropdowns (generated)
├── model_artifacts_real_sampled_v3.joblib # Trained model and preprocessor artifacts (generated)
├── predict_fake_report.py    # Script to load artifacts and predict anomaly for a single report
├── README.md                 # This file
├── requirements.txt          # Python dependencies
└── vihaan.ipynb              # Script to load data, preprocess, train models, and save artifacts
└── api_server.py             # Script to deploy a fastapi to inference the ML model
```

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Ensure Data:** Place the necessary raw CSV files (patients.csv, encounters.csv, etc.) inside the `archive/` directory.

## Environment Variables

The scripts use environment variables for configuration. You can set these in your shell or using a `.env` file (requires `python-dotenv` package, add it to `requirements.txt` if needed).

*   **`BASE_DIR`**: Path to the directory containing raw CSV data. (Default: `archive`)
*   **`OPTIONS_JSON_FILE`**: Path to the output/input JSON file for frontend options. (Default: `frontend_options.json`)
*   **`OUTPUT_ARTIFACTS_FILE`**: Path where the training script saves the model artifacts. (Default: `model_artifacts_real_sampled_v3.joblib`)
*   **`ARTIFACTS_FILE`**: Path from where the prediction script loads the model artifacts. (Default: `model_artifacts_real_sampled_v3.joblib`)
*   **`VALIDATION_SPLIT_SIZE`**: Proportion of data to use for validation split in training. (Default: `0.2`)
*   **`TFIDF_MAX_FEATURES`**: Maximum number of features for TF-IDF vectorizer in training. (Default: `1000`)

Example setting an environment variable:
```bash
export ARTIFACTS_FILE='path/to/your/model.joblib'
```

## Usage

1.  **Train the Model:**
    Run this script to process the data in `BASE_DIR`, train the anomaly detection models, and save the artifacts to `OUTPUT_ARTIFACTS_FILE`.
    ```bash
    # Ensure BASE_DIR, OPTIONS_JSON_FILE, OUTPUT_ARTIFACTS_FILE are set if not using defaults
    python3 train_anomaly_model.py
    ```

2.  **Make Predictions:**
    The `predict_fake_report.py` script contains the `predict_report_anomaly(record_dict)` function. You can import and use this function in your application to get anomaly predictions for new report data.
    ```python
    # Example usage in another Python script:
    from predict_fake_report import predict_report_anomaly
    import os

    # Ensure ARTIFACTS_FILE environment variable is set if needed
    # os.environ['ARTIFACTS_FILE'] = 'path/to/your/model.joblib'

    new_report = {
        'age': 50,
        'gender': 'Male',
        'drugName': 'Lisinopril',
        'dosage_numeric': 20,
        'trialDuration': 120,
        'knownAllergies': [],
        'conditions_during_encounter': ['Hypertension'],
        'new_conditions_after_med_start': [],
        'trialSideEffects': [],
        'count_side_effect_keywords_obs': 0,
        'count_improvement_keywords_obs': 1,
        'count_worsening_keywords_obs': 0,
        'has_impossible_observation': False,
        'avg_temp_during_trial': 36.9,
        'max_hr_during_trial': 78,
        'min_bp_systolic_during_trial': 125,
        'max_bp_systolic_during_trial': 135,
        'min_bp_diastolic_during_trial': 80,
        'max_bp_diastolic_during_trial': 88,
        'proc_count': 1,
        'claim_count': 1,
        'doctorNotes': 'Patient stable on current dose.',
        'noteLength': 30,
        'noteWordCount': 5,
        'sideEffectSeverity': 'None',
        'symptomImprovementScore': 8,
        'overallHealthStatus': 'Improved'
        # Add all required features...
    }

    prediction_result = predict_report_anomaly(new_report)
    print(prediction_result)

    ```

## Notes

*   The model artifacts (`.joblib` file) contain the preprocessor and trained models. Ensure the environment where predictions are made has the same major versions of `scikit-learn` and other relevant libraries used during training.
*   The prediction script expects input data structured similarly to how features were engineered in the training script.
