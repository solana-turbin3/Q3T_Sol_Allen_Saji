use anchor_lang::prelude::*;

declare_id!("FiTx6nFmuJnP7AX63RrXHWKZRDZL6FYTDFX1EQ61Ajvz");

#[program]
pub mod nf_tickets {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
