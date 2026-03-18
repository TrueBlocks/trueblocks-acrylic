import { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Stack, TextInput, Slider, Button, Text, Group, Box } from '@mantine/core';
import { IconPhoto, IconUpload, IconClipboard } from '@tabler/icons-react';
import { OnFileDrop, OnFileDropOff } from '@wailsjs/runtime/runtime';
import { ProcessImage, SelectImageFile, SavePastedImage } from '@app';
import { LogErr } from '@/utils';
import { notifications } from '@mantine/notifications';

interface NewProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewProjectModal({ opened, onClose, onCreated }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [nColors, setNColors] = useState(10);
  const [imagePath, setImagePath] = useState('');
  const [creating, setCreating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const setImageFromPath = useCallback((path: string) => {
    setImagePath(path);
    const fileName = path.split('/').pop() || '';
    const baseName = fileName.replace(/\.[^.]+$/, '');
    if (baseName) setName(baseName);
  }, []);

  useEffect(() => {
    if (!opened) return;

    const handleFileDrop = (_x: number, _y: number, paths: string[]) => {
      if (paths.length > 0) {
        setImageFromPath(paths[0]);
        setDragOver(false);
      }
    };

    OnFileDrop(handleFileDrop, true);
    return () => {
      OnFileDropOff();
    };
  }, [opened, setImageFromPath]);

  useEffect(() => {
    if (!opened) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (!blob) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (!dataUrl) return;
            SavePastedImage(dataUrl)
              .then((path) => setImageFromPath(path))
              .catch((err) => LogErr('Failed to save pasted image:', err));
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [opened, setImageFromPath]);

  const handleClick = useCallback(() => {
    SelectImageFile()
      .then((path) => {
        if (path) setImageFromPath(path);
      })
      .catch((err) => LogErr('Failed to select image:', err));
  }, [setImageFromPath]);

  const handleCreate = useCallback(async () => {
    if (!imagePath || !name) return;
    setCreating(true);
    try {
      await ProcessImage(imagePath, name, nColors);
      notifications.show({
        message: 'Project created',
        color: 'green',
        autoClose: 2000,
      });
      setName('');
      setImagePath('');
      setNColors(10);
      onCreated();
    } catch (err) {
      LogErr('Failed to create project:', err);
      notifications.show({
        message: 'Failed to create project',
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setCreating(false);
    }
  }, [imagePath, name, nColors, onCreated]);

  return (
    <Modal opened={opened} onClose={onClose} title="New Project" size="md">
      <Stack gap="md">
        <Box
          ref={dropRef}
          onClick={handleClick}
          onDragOver={(e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          style={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ['--wails-drop-target' as any]: 'drop',
            border: `2px dashed ${dragOver ? 'var(--mantine-color-blue-5)' : 'var(--mantine-color-gray-4)'}`,
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
            cursor: 'pointer',
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: dragOver ? 'var(--mantine-color-blue-0)' : undefined,
            transition: 'border-color 150ms, background-color 150ms',
          }}
        >
          {imagePath ? (
            <Text size="sm" c="green">
              <IconPhoto size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {imagePath.split('/').pop()}
            </Text>
          ) : (
            <>
              <IconUpload size={32} color="var(--mantine-color-gray-5)" />
              <Text size="sm" c="dimmed">
                Drop image, click to browse, or paste from clipboard
              </Text>
              <Group gap="xs">
                <IconPhoto size={14} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">
                  JPG, PNG, GIF
                </Text>
                <IconClipboard size={14} color="var(--mantine-color-gray-5)" />
                <Text size="xs" c="dimmed">
                  ⌘V to paste
                </Text>
              </Group>
            </>
          )}
        </Box>

        <TextInput
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter project name"
        />

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Number of Colors: {nColors}
          </Text>
          <Slider
            value={nColors}
            onChange={setNColors}
            min={2}
            max={40}
            step={1}
            marks={[
              { value: 2, label: '2' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 40, label: '40' },
            ]}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={creating} disabled={!imagePath || !name}>
            Create
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
