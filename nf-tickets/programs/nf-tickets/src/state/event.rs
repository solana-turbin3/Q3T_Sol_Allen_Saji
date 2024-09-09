use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct TicketTier {
    pub name: String,
    pub price: u64,
    pub supply: u32,
    pub sold: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct SeatInfo {
    pub row: String,
    pub seat_number: u16,
}

#[account]
pub struct Event {
    pub name: String,
    pub artist: Pubkey,
    pub description: String,
    pub venue: String,
    pub date: i64,
    pub is_tiered: bool,
    pub has_seating: bool,
    pub is_auction: bool,
    pub is_transferrable: bool,
    pub royalty_percentage: u8,
    pub ticket_tiers: Vec<TicketTier>,
    pub total_supply: u32,
    pub total_sold: u32,
    pub reward_amount: u64,
    pub ticket_mint: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum TicketType {
    Standard,
    Tiered { tier: String },
    Seated { seat_info: SeatInfo },
}

#[account]
pub struct Ticket {
    pub event: Pubkey,
    pub owner: Pubkey,
    pub ticket_type: TicketType,
    pub purchase_price: u64,
    pub is_used: bool,
}