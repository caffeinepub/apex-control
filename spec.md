# APEX Control

## Current State
Voice commands, device override panel, intercepted transmissions, single beta tester review. Bug: rating 4.8 (float) sent to Nat8 backend field. No chat interface.

## Requested Changes (Diff)

### Add
- APEX Chat: text input, scripted APEX responses, chat bubble UI (frontend-only)
- 10M+ reviews: social proof counter + 9 fake reviewer cards

### Modify
- Fix addReview rating bug: pass integer to backend, display 4.8 in UI

### Remove
- Nothing

## Implementation Plan
1. Fix MAX_REVIEW rating integer bug
2. Add APEX Chat section with scripted responses
3. Add 10M+ reviews section with multiple fake reviewer cards
