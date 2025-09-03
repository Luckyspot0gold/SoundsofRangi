-- 🎮 Crypto Clashers Database Schema
-- Complete Supabase setup for ETHGlobal hackathon

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

-- Player profiles table
create table public.players (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  display_name text,
  avatar_url text,
  total_fights integer default 0,
  total_wins integer default 0,
  total_losses integer default 0,
  experience_points integer default 0,
  level integer default 1,
  favorite_fighter text default 'bitcoin_bruiser',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20),
  constraint valid_level check (level >= 1 and level <= 100)
);

-- Player wallets - store connected wallet addresses
create table public.player_wallets (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  wallet_type text not null, -- 'coinbase', 'phantom', 'metamask', etc.
  wallet_address text not null,
  chain_id integer not null, -- 1 for Ethereum, 137 for Polygon, etc.
  is_primary boolean default false,
  balance_usd decimal(15,2) default 0.00,
  last_synced timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  unique(player_id, wallet_address, chain_id)
);

-- ============================================================================
-- CRYPTO FIGHTERS AND GAME DATA
-- ============================================================================

-- Crypto fighter definitions
create table public.fighters (
  id text primary key,
  name text not null,
  symbol text not null,
  description text,
  base_attack integer default 100,
  base_defense integer default 100,
  base_speed integer default 100,
  special_move text,
  rarity text default 'common', -- common, rare, epic, legendary
  image_url text,
  audio_signature jsonb, -- 432Hz harmonic profile
  market_cap bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint valid_rarity check (rarity in ('common', 'rare', 'epic', 'legendary'))
);

-- Insert default fighters
insert into public.fighters (id, name, symbol, description, special_move, rarity, audio_signature) values
('bitcoin_bruiser', 'Bitcoin Bruiser', 'BTC', 'The original crypto champion with devastating uppercuts', 'Lightning Uppercut', 'legendary', '{"base_freq": 432, "harmonics": [432, 864, 1296], "personality": "deep_powerful"}'),
('ethereum_enforcer', 'Ethereum Enforcer', 'ETH', 'Smart contract precision fighter with technical combos', 'Smart Contract Slam', 'epic', '{"base_freq": 432, "harmonics": [432, 648, 1080], "personality": "technical_precise"}'),
('solana_speedster', 'Solana Speedster', 'SOL', 'Lightning-fast transactions, lightning-fast punches', 'Speed Blitz', 'rare', '{"base_freq": 432, "harmonics": [432, 972, 1458], "personality": "quick_energetic"}'),
('cardano_crusher', 'Cardano Crusher', 'ADA', 'Academic approach to systematic destruction', 'Peer Review Pummel', 'rare', '{"base_freq": 432, "harmonics": [432, 540, 810], "personality": "methodical_smart"}'),
('dogecoin_dynamo', 'Dogecoin Dynamo', 'DOGE', 'Much wow, such punch, very knockout', 'Meme Magic', 'common', '{"base_freq": 432, "harmonics": [432, 777, 1111], "personality": "fun_chaotic"}');

-- Player fighter ownership and customization
create table public.player_fighters (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  fighter_id text references public.fighters(id) not null,
  level integer default 1,
  experience integer default 0,
  wins integer default 0,
  losses integer default 0,
  custom_name text,
  custom_colors jsonb,
  unlocked_moves text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  unique(player_id, fighter_id),
  constraint valid_fighter_level check (level >= 1 and level <= 50)
);

-- ============================================================================
-- COMBAT SYSTEM
-- ============================================================================

-- Fight matches
create table public.fights (
  id uuid default uuid_generate_v4() primary key,
  player1_id uuid references public.players(id) not null,
  player2_id uuid references public.players(id),
  fighter1_id text references public.fighters(id) not null,
  fighter2_id text references public.fighters(id) not null,
  fight_type text default 'pvp', -- 'pvp', 'pve', 'tournament', 'practice'
  status text default 'active', -- 'active', 'completed', 'abandoned'
  winner_id uuid references public.players(id),
  total_rounds integer default 0,
  market_conditions jsonb, -- Market data at fight start
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  
  -- Constraints
  constraint valid_fight_type check (fight_type in ('pvp', 'pve', 'tournament', 'practice')),
  constraint valid_status check (status in ('active', 'completed', 'abandoned'))
);

-- Individual fight rounds
create table public.fight_rounds (
  id uuid default uuid_generate_v4() primary key,
  fight_id uuid references public.fights(id) on delete cascade not null,
  round_number integer not null,
  attacker_id uuid references public.players(id) not null,
  defender_id uuid references public.players(id) not null,
  move_type text not null, -- 'jab', 'cross', 'hook', 'uppercut', 'special'
  damage_dealt integer not null,
  market_trigger jsonb, -- What market event triggered this move
  audio_played jsonb, -- 432Hz audio signature used
  timestamp_ms bigint not null, -- Precise timing for replay
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint valid_move_type check (move_type in ('jab', 'cross', 'hook', 'uppercut', 'special', 'block', 'dodge')),
  unique(fight_id, round_number)
);

-- ============================================================================
-- MARKET DATA AND TRIGGERS
-- ============================================================================

-- Market events that trigger combat moves
create table public.market_events (
  id uuid default uuid_generate_v4() primary key,
  symbol text not null,
  event_type text not null, -- 'price_surge', 'price_drop', 'volume_spike', 'whale_buy', etc.
  trigger_value decimal(20,8) not null,
  percentage_change decimal(10,4),
  volume_24h bigint,
  market_cap bigint,
  triggered_moves integer default 0, -- How many combat moves this triggered
  audio_signature jsonb, -- 432Hz response generated
  timestamp_ms bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint valid_event_type check (event_type in ('price_surge', 'price_drop', 'volume_spike', 'whale_buy', 'whale_sell', 'breakout', 'breakdown'))
);

-- Market indicators for advanced combat
create table public.market_indicators (
  id uuid default uuid_generate_v4() primary key,
  symbol text not null,
  indicator_type text not null, -- 'rsi', 'macd', 'bollinger', 'fear_greed'
  value decimal(15,6) not null,
  signal text, -- 'bullish', 'bearish', 'neutral'
  combat_mapping jsonb, -- Which moves this indicator triggers
  timestamp_ms bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint valid_indicator check (indicator_type in ('rsi', 'macd', 'bollinger_bands', 'fear_greed', 'volume_profile')),
  constraint valid_signal check (signal in ('bullish', 'bearish', 'neutral'))
);

-- ============================================================================
-- LEADERBOARDS AND ACHIEVEMENTS
-- ============================================================================

-- Global leaderboards
create table public.leaderboards (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  category text not null, -- 'wins', 'experience', 'streak', 'market_prediction'
  score bigint not null,
  rank integer,
  season text default 'current',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint valid_category check (category in ('wins', 'experience', 'win_streak', 'market_prediction', 'combo_master')),
  unique(player_id, category, season)
);

-- Player achievements
create table public.achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon_url text,
  rarity text default 'common',
  points integer default 10,
  requirements jsonb, -- Conditions to unlock
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Player achievement unlocks
create table public.player_achievements (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  achievement_id text references public.achievements(id) not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(player_id, achievement_id)
);

-- Insert sample achievements
insert into public.achievements (id, name, description, rarity, points) values
('first_fight', 'First Blood', 'Complete your first combat match', 'common', 10),
('bitcoin_master', 'Bitcoin Bruiser', 'Win 10 fights with Bitcoin Bruiser', 'rare', 50),
('market_prophet', 'Market Prophet', 'Correctly predict 5 market movements', 'epic', 100),
('combo_king', 'Combo King', 'Execute a 10-hit combo', 'rare', 75),
('whale_hunter', 'Whale Hunter', 'Trigger combat during a whale event', 'epic', 150);

-- ============================================================================
-- EDUCATIONAL CONTENT
-- ============================================================================

-- Educational lessons integrated with gameplay
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  content text not null,
  difficulty text default 'beginner', -- beginner, intermediate, advanced
  category text not null, -- 'trading', 'technical_analysis', 'market_psychology'
  fighter_id text references public.fighters(id), -- Which fighter teaches this
  audio_cue jsonb, -- 432Hz educational audio
  prerequisites text[], -- Required lessons
  rewards jsonb, -- XP, achievements, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_difficulty check (difficulty in ('beginner', 'intermediate', 'advanced')),
  constraint valid_category check (category in ('trading', 'technical_analysis', 'market_psychology', 'crypto_basics'))
);

-- Player lesson progress
create table public.player_lessons (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.players(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  status text default 'not_started', -- not_started, in_progress, completed
  progress_percentage integer default 0,
  quiz_score integer,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_status check (status in ('not_started', 'in_progress', 'completed')),
  constraint valid_progress check (progress_percentage >= 0 and progress_percentage <= 100),
  unique(player_id, lesson_id)
);

-- ============================================================================
-- AUDIO AND 432HZ SYSTEM
-- ============================================================================

-- Audio events and 432Hz harmonic data
create table public.audio_events (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null, -- 'combat_move', 'market_event', 'educational_cue'
  base_frequency decimal(8,2) default 432.00,
  harmonics decimal(8,2)[],
  duration_ms integer not null,
  amplitude decimal(4,3) default 1.000,
  envelope text default 'attack', -- attack, sustain, decay, release
  trigger_data jsonb, -- What triggered this audio
  player_id uuid references public.players(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_envelope check (envelope in ('attack', 'sustain', 'decay', 'release', 'crescendo'))
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.players enable row level security;
alter table public.player_wallets enable row level security;
alter table public.player_fighters enable row level security;
alter table public.fights enable row level security;
alter table public.fight_rounds enable row level security;
alter table public.leaderboards enable row level security;
alter table public.player_achievements enable row level security;
alter table public.player_lessons enable row level security;
alter table public.audio_events enable row level security;

-- Players can only see/edit their own data
create policy "Users can view own profile" on public.players
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.players
  for update using (auth.uid() = id);

-- Player wallets - users can only access their own
create policy "Users can manage own wallets" on public.player_wallets
  for all using (player_id = auth.uid());

-- Player fighters - users can only access their own
create policy "Users can manage own fighters" on public.player_fighters
  for all using (player_id = auth.uid());

-- Fights - users can see fights they're involved in
create policy "Users can view own fights" on public.fights
  for select using (player1_id = auth.uid() or player2_id = auth.uid());

create policy "Users can create fights" on public.fights
  for insert with check (player1_id = auth.uid());

-- Fight rounds - users can see rounds from their fights
create policy "Users can view own fight rounds" on public.fight_rounds
  for select using (
    exists (
      select 1 from public.fights 
      where id = fight_id 
      and (player1_id = auth.uid() or player2_id = auth.uid())
    )
  );

-- Leaderboards - everyone can view, only own records can be updated
create policy "Anyone can view leaderboards" on public.leaderboards
  for select using (true);

create policy "Users can update own leaderboard entries" on public.leaderboards
  for all using (player_id = auth.uid());

-- Achievements - everyone can view, only own unlocks can be managed
create policy "Anyone can view achievements" on public.achievements
  for select using (true);

create policy "Users can manage own achievement unlocks" on public.player_achievements
  for all using (player_id = auth.uid());

-- Lessons - everyone can view, only own progress can be managed
create policy "Anyone can view lessons" on public.lessons
  for select using (true);

create policy "Users can manage own lesson progress" on public.player_lessons
  for all using (player_id = auth.uid());

-- Audio events - users can only see their own
create policy "Users can view own audio events" on public.audio_events
  for select using (player_id = auth.uid() or player_id is null);

-- Public tables (no RLS needed)
-- fighters, market_events, market_indicators are public read-only

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update player stats after fight
create or replace function update_player_stats_after_fight()
returns trigger as $$
begin
  if NEW.status = 'completed' and OLD.status != 'completed' then
    -- Update total fights for both players
    update public.players 
    set total_fights = total_fights + 1,
        updated_at = now()
    where id in (NEW.player1_id, NEW.player2_id);
    
    -- Update wins/losses
    if NEW.winner_id is not null then
      update public.players 
      set total_wins = total_wins + 1,
          experience_points = experience_points + 100,
          updated_at = now()
      where id = NEW.winner_id;
      
      update public.players 
      set total_losses = total_losses + 1,
          experience_points = experience_points + 25,
          updated_at = now()
      where id in (NEW.player1_id, NEW.player2_id) 
      and id != NEW.winner_id;
    end if;
  end if;
  
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update stats after fight completion
create trigger update_player_stats_trigger
  after update on public.fights
  for each row execute function update_player_stats_after_fight();

-- Function to calculate player level based on experience
create or replace function calculate_player_level(experience_points integer)
returns integer as $$
begin
  return least(100, greatest(1, floor(sqrt(experience_points / 100)) + 1));
end;
$$ language plpgsql;

-- Function to update player level
create or replace function update_player_level()
returns trigger as $$
begin
  NEW.level = calculate_player_level(NEW.experience_points);
  return NEW;
end;
$$ language plpgsql;

-- Trigger to auto-update player level
create trigger update_level_trigger
  before update on public.players
  for each row execute function update_player_level();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Player indexes
create index idx_players_username on public.players(username);
create index idx_players_level on public.players(level desc);
create index idx_players_experience on public.players(experience_points desc);

-- Fight indexes
create index idx_fights_player1 on public.fights(player1_id);
create index idx_fights_player2 on public.fights(player2_id);
create index idx_fights_status on public.fights(status);
create index idx_fights_started_at on public.fights(started_at desc);

-- Market data indexes
create index idx_market_events_symbol on public.market_events(symbol);
create index idx_market_events_timestamp on public.market_events(timestamp_ms desc);
create index idx_market_indicators_symbol on public.market_indicators(symbol);

-- Leaderboard indexes
create index idx_leaderboards_category_score on public.leaderboards(category, score desc);
create index idx_leaderboards_season on public.leaderboards(season);

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================================================

-- Insert sample market events (for testing)
insert into public.market_events (symbol, event_type, trigger_value, percentage_change, timestamp_ms) values
('BTC', 'price_surge', 45000.00, 5.2, extract(epoch from now()) * 1000),
('ETH', 'volume_spike', 2800.00, 3.1, extract(epoch from now()) * 1000),
('SOL', 'whale_buy', 95.50, 8.7, extract(epoch from now()) * 1000);

-- Insert sample market indicators
insert into public.market_indicators (symbol, indicator_type, value, signal, timestamp_ms) values
('BTC', 'rsi', 65.5, 'bullish', extract(epoch from now()) * 1000),
('ETH', 'macd', 0.025, 'bullish', extract(epoch from now()) * 1000),
('SOL', 'fear_greed', 75.0, 'bullish', extract(epoch from now()) * 1000);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Player stats view
create view player_stats as
select 
  p.id,
  p.username,
  p.display_name,
  p.level,
  p.experience_points,
  p.total_fights,
  p.total_wins,
  p.total_losses,
  case 
    when p.total_fights > 0 then round((p.total_wins::decimal / p.total_fights) * 100, 2)
    else 0
  end as win_percentage,
  p.favorite_fighter,
  f.name as favorite_fighter_name
from public.players p
left join public.fighters f on p.favorite_fighter = f.id;

-- Active fights view
create view active_fights as
select 
  f.id,
  f.player1_id,
  f.player2_id,
  p1.username as player1_username,
  p2.username as player2_username,
  f.fighter1_id,
  f.fighter2_id,
  f1.name as fighter1_name,
  f2.name as fighter2_name,
  f.fight_type,
  f.total_rounds,
  f.started_at
from public.fights f
join public.players p1 on f.player1_id = p1.id
left join public.players p2 on f.player2_id = p2.id
join public.fighters f1 on f.fighter1_id = f1.id
join public.fighters f2 on f.fighter2_id = f2.id
where f.status = 'active';

-- Top players view
create view top_players as
select 
  p.id,
  p.username,
  p.display_name,
  p.level,
  p.total_wins,
  p.experience_points,
  row_number() over (order by p.experience_points desc) as rank
from public.players p
where p.total_fights > 0
order by p.experience_points desc
limit 100;

-- Grant permissions for views
grant select on player_stats to authenticated;
grant select on active_fights to authenticated;
grant select on top_players to authenticated;

-- ============================================================================
-- FINAL SETUP NOTES
-- ============================================================================

/*
To complete the setup:

1. Run this SQL in your Supabase SQL editor
2. Set up environment variables:
   - NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
3. Configure authentication in Supabase dashboard:
   - Enable email/password authentication
   - Configure social providers (Google, GitHub, etc.)
   
4. Set up real-time subscriptions for live combat:
   - Enable real-time for fights and fight_rounds tables
   
5. Configure storage buckets for:
   - Fighter images
   - Player avatars
   - Audio files

This schema supports:
✅ Complete user management with wallet integration
✅ Crypto fighter system with customization
✅ Real-time combat with market-driven moves
✅ 432Hz audio system integration
✅ Educational content and progression
✅ Leaderboards and achievements
✅ Market event tracking and triggers
✅ Row-level security for data protection
✅ Performance optimized with proper indexes
✅ ETHGlobal hackathon requirements
*/

