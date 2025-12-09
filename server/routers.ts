import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createUserList, deleteUserList, getUserLists, updateUserList } from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Lists API
  lists: router({
    // Get all lists for a specific type (wheel or group)
    getByType: protectedProcedure
      .input(z.object({ listType: z.enum(["wheel", "group"]) }))
      .query(async ({ ctx, input }) => {
        const lists = await getUserLists(ctx.user.id, input.listType);
        return lists.map(list => ({
          ...list,
          items: JSON.parse(list.items) as string[],
        }));
      }),

    // Create a new list
    create: protectedProcedure
      .input(z.object({
        listType: z.enum(["wheel", "group"]),
        name: z.string().min(1).max(100),
        items: z.array(z.string()),
        isDefault: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await createUserList({
          userId: ctx.user.id,
          listType: input.listType,
          name: input.name,
          items: JSON.stringify(input.items),
          isDefault: input.isDefault ?? 0,
        });
        return { id };
      }),

    // Update an existing list
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        items: z.array(z.string()).optional(),
        isDefault: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updateData: Record<string, unknown> = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.items !== undefined) updateData.items = JSON.stringify(input.items);
        if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;

        await updateUserList(input.id, ctx.user.id, updateData);
        return { success: true };
      }),

    // Delete a list
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteUserList(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
