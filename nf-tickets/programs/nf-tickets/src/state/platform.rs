use anchor_lang::prelude::*;

#[account]
pub struct Platform {
    pub admin: Pubkey,
    pub platform_name: String,
    pub platform_bump: u8,
    pub treasury_bump: u8,
    pub rewards_bump: u8,
}

impl Space for Marketplace {
    const INIT_SPACE: usize = 8 + 32 + (4 + 32) + 1 + 1 + 1 ;
}