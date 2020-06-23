export const USER_DATA = {
  workspaces: {
    user: [
      {
        id: 'workspace-1',
        label: 'Impact of underwater noise on sperm whales',
        description:
          'Investigate the overlap of anthropogenic underwater noise with sensitive species such as sperm whales to help structure campaigns and advocate for better regulation of noisy activities to protect cetaceans.',
        editors: [
          { id: 'editor-1', email: 'editor1@gmail.com' },
          { id: 'editor-2', email: 'editor2@gmail.com' },
          { id: 'editor-3', email: 'editor3@gmail.com' },
        ],
      },
      {
        id: 'workspace-2',
        label: 'IUU risk around Galapagos Marine Reserve',
        editors: [{ id: 'editor-1', email: 'editor1@gmail.com' }],
      },
      {
        id: 'workspace-3',
        label: 'Turtles bycatch risk around Galapagos Islands',
        editors: [],
      },
    ],
    shared: [
      { id: 'workspace-5', label: 'Shared Worspace 1' },
      { id: 'workspace-6', label: 'Shared Worspace 2' },
    ],
  },
  aois: [
    { id: 'aoi-1', label: 'Galapagos Marine Reserve' },
    { id: 'aoi-2', label: 'Caribbean Sea' },
  ],
  datasets: {
    user: [
      {
        id: 'dataset-1',
        label: 'Dataset Name 1',
        editors: [
          { id: 'editor-1', email: 'editor1@gmail.com' },
          { id: 'editor-2', email: 'editor2@gmail.com' },
          { id: 'editor-3', email: 'editor3@gmail.com' },
        ],
      },
      {
        id: 'dataset-2',
        label: 'Dataset Name 2',
        editors: [
          { id: 'editor-1', email: 'editor1@gmail.com' },
          { id: 'editor-2', email: 'editor2@gmail.com' },
          { id: 'editor-3', email: 'editor3@gmail.com' },
        ],
      },
      {
        id: 'dataset-3',
        label: 'Dataset Name 3',
        editors: [
          { id: 'editor-1', email: 'editor1@gmail.com' },
          { id: 'editor-2', email: 'editor2@gmail.com' },
          { id: 'editor-3', email: 'editor3@gmail.com' },
        ],
      },
    ],
    shared: [{ id: 'dataset-6', label: 'Shared Dataset Name 1' }],
  },
}
