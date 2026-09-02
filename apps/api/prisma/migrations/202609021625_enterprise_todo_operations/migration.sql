CREATE TYPE "TodoPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

ALTER TABLE "Todo"
ADD COLUMN "priority" "TodoPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "dueDate" TIMESTAMP(3);

CREATE INDEX "Todo_completed_createdAt_idx" ON "Todo"("completed", "createdAt");
CREATE INDEX "Todo_priority_createdAt_idx" ON "Todo"("priority", "createdAt");
