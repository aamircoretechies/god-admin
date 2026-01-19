import { ReactNode } from 'react';
import { toAbsoluteUrl } from '@/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogBody
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteUserModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title?: string;
    description?: ReactNode;
    confirmButtonText?: string;
}

const DeleteUserModal = ({
    isOpen,
    onOpenChange,
    onConfirm,
    isDeleting,
    title = "Confirm Deletion",
    description,
    confirmButtonText
}: DeleteUserModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-[500px] max-h-[95%] scrollable-y-auto">
                <DialogHeader className="justify-end border-0 pt-5">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <DialogBody className="flex flex-col items-center pt-0 pb-10">
                    <div className="mb-9">
                        <img
                            src={toAbsoluteUrl('/media/illustrations/23.svg')}
                            className="dark:hidden max-h-[150px]"
                            alt="warning"
                        />
                        <img
                            src={toAbsoluteUrl('/media/illustrations/23-dark.svg')}
                            className="light:hidden max-h-[150px]"
                            alt="warning dark"
                        />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 text-center mb-3">
                        {title}
                    </h3>

                    <div className="text-2sm text-center text-gray-700 mb-7 px-10">
                        {description || (
                            <>
                                Are you sure you want to delete this user? This action <strong>cannot be undone</strong> and will permanently delete all user data including activities, bookmarks, and preferences.
                            </>
                        )}
                    </div>

                    <div className="flex justify-center gap-2.5 w-full">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isDeleting}
                            className="btn btn-light min-w-[120px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="btn btn-danger min-w-[120px]"
                        >
                            {isDeleting ? 'Deleting...' : (confirmButtonText || 'Delete User')}
                        </Button>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export { DeleteUserModal };

