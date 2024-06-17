import {Button, Modal, Frame} from '@shopify/polaris';

function ConfirmationModal({isOpen, setIsOpen, onConfirm, content}) {
  console.log('content', content);
  return (
    <Frame>
      <div style={{height: '500px'}}>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirmation"
          primaryAction={{
            destructive: true,
            content: 'Discard changes',
            onAction: () => setIsOpen(false),
          }}
          secondaryActions={[
            {
              content: 'Continue adding',
              onAction: () => {
                onConfirm();
                setIsOpen(false);
              },
            },
          ]}
        >
          <Modal.Section>Are you sure you want to continue of adding the following changes ?
          </Modal.Section>
        </Modal>
      </div>
    </Frame>
  );
}

export default ConfirmationModal;