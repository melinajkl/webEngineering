import {z} from "zod";

export const StepSchema = z.object({
    text: z.string().min(1, "A step must contain at least one character."),
});


const CreateStepRowSchema = StepSchema.pick({
    text: true,
});

export type iDbSteps = z.infer<typeof CreateStepRowSchema>;