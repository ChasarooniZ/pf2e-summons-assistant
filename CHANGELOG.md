## 1.8.2

- **Updates**
  - Updated `Conglomerate of Limbs` to use the actor from `Pf2e Playtest`
  - Fixed issue where rolls were being counted as a message the summons (@Loki123)

## 1.8.1

- **Updates**
  - Fixed issue with some properties not being optionally chained causing `Manifest Eidolon` to fail

## 1.8.0

- **New**
  - Support for the following:
    - `Conglomerate of Limbs`
    - `Manifest Eidolon` (🖥️ @Sasane)

## 1.7.0

- **New**
  - `Living Graveyard - Movement Summon`
    - On Movement ask the user if they want to summon 3 thralls from the living graveyard (🖥️ @Sasane)
  - `Show Only Token With Art`
    - Adds a setting to default the picker to show only tokens with art
- **Updates**
  - Added localization to some action
  - Updated required version of **Foundry Summons** to `2.3.3`

## 1.6.2

- Handle exception for the Effect Ownership settings, when the token is a wildcard token

## 1.6.1

- Fixed update message not firing for previous version

## 1.6.0

- **New**
  - Support for for SF2e's Mechanic's `Mines` (🎨@Sasane, 🖥️@Sasane)
  - `Update Messages`
    - Little update messages for each new update will appear the first time you open a server after an update
- **Updates**
  - Updated French translation (@rectulo)
  - Updated Polish Translation (@Lioheart)

## 1.5.2

- **Updates**
  - Added handling for art of people who don't own `jb2a_patreon`

## 1.5.1

- **Updates**
  - Fixed bug causing the light spell to not function properly
- **Languages**
  - Added French translation (@rectulo)
  - Updated Polish Translation (@Lioheart)

## 1.5.0

- **New**
  - `House Rule`
    - **Summon Spells Scale to Max Level**
      - This uses PF2e Workbench's Scale to level code to scale creatures summoned via traditional summoning spells (IE Summon Animals etc.) to the stats of a creature of the highest level that spell rank can summon.

## 1.4.0

- **New**
  - Added support for
    - `Call Fluxwraith`
  - Added new option for the House Rule `Summon Spells are Rank + 1`
    - Treats summon spells as one rank higher for the purpose of what creatures they can summon

## 1.3.0

- **New**
  - Add Expiration Date for `Necromancer` thralls
  - Added setting to allow adding an Icon showing the summoner of the creature
  - Added support for these:
    - `Floating Flame` - Art Requires JB2a
    - `Summon Elemental Herald` - Art requires `Pathfinder Tokens: Bestiary`
    - `Inevitable Return` (Necromancer)
- **Fixed**
  - Fixed traits on `Necromancer` Thralls to not include minion or summoned

## 1.2.1

- Fixed bug where specific summon spells might not go off as planned due to level restriction (@Dods)

## 1.2.0

- **New**
  - Added handling for some `Necromancer` spells from the Playtest
    - `Create Thrall`
    - `Perfected Thrall`
    - `Skeletal Lancers`
    - `Living Graveyard` - Currently does **not** handle the sustain action it has
    - `Recurring Nightmares`
    - `Bind Heroic Spirit - On Successful Attack`
  - **_Note._** Currently does not track the time remaining for the summons

## 1.1.3

- Added compatability patch for `fromUuid` for v12 (🐛 @RayG)

## 1.1.2

- Added Polish Translation (@Lioheart)

## 1.1.1

- `Updated`
  - Added `Arrival` and `Depart` actions to the `Incarnate` Summons
    - **_Note_** using these actions directly would be missing any `RollOptions` from the original token/spellcasting and as such extra attention should be paid to specific interactions
    - IE: If you would gain +2 circumstance bonus on saving throws against `Goblins` that would need to be manually toggled
  - Added a `dc` attribute to key the saves on in `Incarnate` actions (captured at the point they are `Arrive`)

## 1.1.0

- `New`
  - Added Summon support for the following spell/feats:
    - `Call Ursine Ally`
    - `Light` (requires JB2a)
    - `Healing Servitor` - Includes homemade art for it
    - `Tempest of Shades` - Includes Homemade art for it
  - Added Feature to allow summons to be named based on the creature that summoned it
  - Added appropriate traits to summons when summoned
- `Updated`
  - Requires **Foundry Summons** `2.3.1`
  - For Summons with 1 option, it now skips straight to the summon interface (@Sasane)

## 1.0.4

- `New`
  - Support for `Phantasmal Minion` spell
- `Fixed`
  - Fixed V12 support (@Sasane)

## 1.0.3

- `Updated`
  - Set the Summon's alliance to that of the summoner (@Sasane)
  - Added a recommendation for the `PF2e Sustain Reminder` module to track summons duration
  - Preparing for future handling of other use cases `Incarnate` spells etc.

## 1.0.2

- Actually released the changes from `1.0.1`

## 1.0.1

- `Changes`
  - a sort order dropdown (@Sasano)
  - a filter by trait when multiple traits were possible (@Sasano)
  - a "Only with image" checkbox (@Sasano)
  - Removed extraneous `Pf2e Toolbelt` code (@Sasano)

## 1.0.0

- `New`
  - Includes support for all official spells with the `Summon` trait
  - When a Spell with the summon tag is `Cast` it will pop up with the Foundry Summons Interface with the appropriate list of summons
  - _Mega Credit to **@Vauxs** for update Foundry Summons which and **@Sasano** for the original macro that interfaced with it <3_
