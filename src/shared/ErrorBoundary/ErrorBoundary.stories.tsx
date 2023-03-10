import { useState } from "react";
// eslint-disable-next-line no-restricted-imports
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { useBoolean } from "@chakra-ui/hooks";
import { Button, VStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { AjaxError } from "utils";

import { ErrorPageStrategy } from "shared/Result";
import { InternalServerErrorResult } from "shared/Result";

import { ErrorBoundary } from "./ErrorBoundary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withRouter = (story: any) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: story(),
      },
    ],
    {
      initialEntries: ["/"],
      initialIndex: 1,
    }
  );

  return <RouterProvider router={router} />;
};

const Throw500Error = () => {
  throw new AjaxError(500, {}, {});
};

const TestableErrorBoundary = ({
  withRecovery,
}: {
  withRecovery?: boolean;
}) => {
  const [throwError, setError] = useBoolean(false);
  const [resetKey, setResetKey] = useState(false);

  return (
    <ErrorBoundary<AjaxError>
      resetKeys={[resetKey]}
      fallback={({ error }) => {
        if (withRecovery) {
          return (
            <InternalServerErrorResult>
              <Button onClick={() => setResetKey((state) => !state)}>
                Try again
              </Button>
            </InternalServerErrorResult>
          );
        }

        return <ErrorPageStrategy error={error} />;
      }}
    >
      <VStack>
        <Button id="test" onClick={setError.on} colorScheme="red">
          Throw an error
        </Button>
        {throwError ? (
          <Throw500Error />
        ) : (
          <div>"Everything is fine... at least now"</div>
        )}
      </VStack>
    </ErrorBoundary>
  );
};

const meta: Meta<typeof TestableErrorBoundary> = {
  title: "Shared/ErrorBoundary",
  component: TestableErrorBoundary,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof TestableErrorBoundary>;

export const Default: Story = {};

export const WithRecovery: Story = {
  args: { withRecovery: true },
};
