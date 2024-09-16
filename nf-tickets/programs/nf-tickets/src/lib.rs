use anchor_lang::prelude::*;

pub mod contexts;
pub mod states;
pub mod errors;

use contexts::*;
use states::*;
pub use errors::*;

declare_id!("FiTx6nFmuJnP7AX63RrXHWKZRDZL6FYTDFX1EQ61Ajvz");

#[program]
pub mod nf_tickets {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
        ctx.accounts.manager.bump = ctx.bumps.manager;
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
