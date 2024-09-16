use anchor_lang::prelude::*;

use crate::states::Manager;

#[derive(Accounts)]
pub struct SetupManager<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       init,
       payer = payer,
       space = Manager::INIT_SPACE,
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump,
   )]
   pub manager: Account<'info, Manager>,
   pub system_program: Program<'info, System>,
}