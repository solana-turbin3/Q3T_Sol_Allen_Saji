use anchor_lang::error_code;

#[error_code]
pub enum NameError {
    #[msg("Name must be between 1 and 32 characters")]
    NameTooLong,
}