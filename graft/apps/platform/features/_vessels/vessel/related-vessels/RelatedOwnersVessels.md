# apps/platform/features/_vessels/vessel/related-vessels/RelatedOwnersVessels.tsx · [[related-vessels-feature]]

TypeScript module that renders a list of vessel owners and their associated vessels for a given vessel.

- OwnerVesselsProps · type · L24-L29 — Type definition for props passed to the OwnerVessels component.
- OwnerVessels · function · L30-L71 — Component that fetches and renders a list of vessels owned by a specific owner, filtering out the current vessel.
- RelatedOwnerVessels · function · L73-L136 — Component that retrieves registry owners for the current vessel and renders them with their associated vessels, deduplicated by owner name and flag.
