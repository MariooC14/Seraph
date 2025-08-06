import { useEffect } from 'react';

function SuccessPanelContent({ onSuccess }: { onSuccess: () => void }) {
  useEffect(() => {
    setTimeout(() => {
      onSuccess();
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-semibold mb-4">Connection Successful</h2>
      <p className="text-gray-600">You will now be redirected to the terminal.</p>
    </div>
  );
}

export default SuccessPanelContent;
