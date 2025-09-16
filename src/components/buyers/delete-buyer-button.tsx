'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { toast } from '@/lib/utils/toast';

interface DeleteBuyerButtonProps {
  buyerId: string;
  buyerName: string;
}

export function DeleteBuyerButton({ buyerId, buyerName }: DeleteBuyerButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/buyers/${buyerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete buyer');
      }

      toast.success('Buyer deleted successfully');
      router.push('/buyers');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Buyer"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{buyerName}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete Buyer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

