# apps/platform/features/_vessels/vessel/identity/fields/VesselTypesField.tsx · [[vessel-identity-field-rendering]]

Module that exports a React component for rendering vessel type or gear type information with conditional display logic based on identity source.

- VesselTypesFieldProps · interface · L9-L13 — Props interface defining the contract for VesselTypesField component requiring vessel identity data, a field key selector, and an identity source enum.
- VesselTypesField · function · L15-L29 — React component that conditionally renders vessel or gear type information, prioritizing Registry identity source and falling back to combined or standard sources.
