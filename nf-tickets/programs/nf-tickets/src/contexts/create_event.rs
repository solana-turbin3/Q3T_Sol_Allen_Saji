use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info, 
    fetch_plugin, 
    instructions::{
        CreateCollectionV2CpiBuilder, 
        CreateV2CpiBuilder, 
        WriteExternalPluginAdapterDataV1CpiBuilder, 
        UpdatePluginV1CpiBuilder
    }, 
    accounts::{BaseAssetV1, BaseCollectionV1}, 
    types::{
        AppDataInitInfo, Attribute, Attributes, 
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey, 
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin, 
        PluginAuthority, PluginAuthorityPair, PluginType
    }, 
};

use crate::states::Manager;

#[derive(Accounts)]
pub struct CreateEvent<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [b"event", signer.key().as_ref()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(mut)]
   pub event: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs {
   pub name: String,
   pub category: String,
   pub uri: String,
   pub city: String,
   pub venue: String,
   pub artist: String,
   pub date: String,
   pub time: String,
   pub capacity: u64,
   pub is_ticket_transferable: bool
}


impl <'info> CreateEvent<'info> {
    pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
        // Add an Attribute Plugin that will hold the event details
        let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];
    
        let attribute_list: Vec<Attribute> = vec![
            Attribute {
                key: "Category".to_string(),
                value: args.category
            },
            Attribute { 
                key: "City".to_string(), 
                value: args.city 
            },
            Attribute { 
                key: "Venue".to_string(), 
                value: args.venue 
            },
            Attribute { 
                key: "Artist".to_string(), 
                value: args.artist 
            },
            Attribute { 
                key: "Date".to_string(), 
                value: args.date 
            },
            Attribute { 
                key: "Time".to_string(), 
                value: args.time 
            },
            Attribute { 
                key: "Capacity".to_string(), 
                value: args.capacity.to_string() 
            },
            Attribute { 
                key: "IsTicketTransferable".to_string(), 
                value: args.is_ticket_transferable.to_string() 
            }
        ];
        
        collection_plugin.push(
            PluginAuthorityPair { 
                plugin: Plugin::Attributes(Attributes { attribute_list }), 
                authority: Some(PluginAuthority::UpdateAuthority) 
            }
        );
        
        // Create the Collection that will hold the tickets
        CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .collection(&ctx.accounts.event.to_account_info())
        .update_authority(Some(&ctx.accounts.manager.to_account_info()))
        .payer(&ctx.accounts.payer.to_account_info())
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name(args.name)
        .uri(args.uri)
        .plugins(collection_plugin)
        .invoke()?;
    
        Ok(())
    }
}
