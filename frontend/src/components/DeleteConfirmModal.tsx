import { Modal, Stack, Text, Group, Button } from '@mantine/core';

interface DeleteConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function DeleteConfirmModal({
  opened,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="sm">
      <Stack gap="md">
        <Text size="sm">{message}</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={onConfirm}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
