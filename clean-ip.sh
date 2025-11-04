Last login: Tue Nov  4 09:03:11 on console
melinaklein@Mac ~ % cd workspace
melinaklein@Mac workspace % cd webEngineering 
melinaklein@Mac webEngineering % git pull 
From https://github.com/melinajkl/webEngineering
 * [new branch]      clean-up   -> origin/clean-up
Already up to date.
melinaklein@Mac webEngineering % git switch clean-up
branch 'clean-up' set up to track 'origin/clean-up'.
Switched to a new branch 'clean-up'
melinaklein@Mac webEngineering % pnpm -v
10.18.1
melinaklein@Mac webEngineering % node -v
v24.8.0
melinaklein@Mac webEngineering % pnpm list --depth 1 > _deps.txt

melinaklein@Mac webEngineering % tree
.
├── README.md
├── _deps.txt
├── components.json
├── drizzle.config.ts
├── next-env.d.ts
├── node_modules
│   ├── @biomejs
│   │   └── biome -> ../.pnpm/@biomejs+biome@2.2.0/node_modules/@biomejs/biome
│   ├── @dnd-kit
│   │   ├── core -> ../.pnpm/@dnd-kit+core@6.3.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@dnd-kit/core
│   │   ├── modifiers -> ../.pnpm/@dnd-kit+modifiers@9.0.0_@dnd-kit+core@6.3.1_react-dom@19.1.0_react@19.1.0__react@19.1.0__react@19.1.0/node_modules/@dnd-kit/modifiers
│   │   ├── sortable -> ../.pnpm/@dnd-kit+sortable@10.0.0_@dnd-kit+core@6.3.1_react-dom@19.1.0_react@19.1.0__react@19.1.0__react@19.1.0/node_modules/@dnd-kit/sortable
│   │   └── utilities -> ../.pnpm/@dnd-kit+utilities@3.2.2_react@19.1.0/node_modules/@dnd-kit/utilities
│   ├── @libsql
│   │   └── client -> ../.pnpm/@libsql+client@0.15.15/node_modules/@libsql/client
│   ├── @radix-ui
│   │   ├── react-avatar -> ../.pnpm/@radix-ui+react-avatar@1.1.10_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react_0c4b88b53d6d537efa4c1268ce7a6c19/node_modules/@radix-ui/react-avatar
│   │   ├── react-checkbox -> ../.pnpm/@radix-ui+react-checkbox@1.3.3_@types+react-dom@19.2.0_@types+react@19.2.0__@types+reac_8aa80661b8e1ec8f91b0eddb604c44f5/node_modules/@radix-ui/react-checkbox
│   │   ├── react-dialog -> ../.pnpm/@radix-ui+react-dialog@1.1.15_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react_343a74ab60414616b0cbbb02a72ca5ac/node_modules/@radix-ui/react-dialog
│   │   ├── react-dropdown-menu -> ../.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.0_@types+react@19.2.0__@type_c7a6217f050aa41da66d862100824349/node_modules/@radix-ui/react-dropdown-menu
│   │   ├── react-label -> ../.pnpm/@radix-ui+react-label@2.1.7_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react@1_cf33717bc1cad32446272c8181bbf471/node_modules/@radix-ui/react-label
│   │   ├── react-navigation-menu -> ../.pnpm/@radix-ui+react-navigation-menu@1.2.14_@types+react-dom@19.2.0_@types+react@19.2.0__@ty_b972a0994f6f7e77b55bc2437f645658/node_modules/@radix-ui/react-navigation-menu
│   │   ├── react-select -> ../.pnpm/@radix-ui+react-select@2.2.6_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react@_9dc5ff0cb696834ae1a84756d66e9204/node_modules/@radix-ui/react-select
│   │   ├── react-separator -> ../.pnpm/@radix-ui+react-separator@1.1.7_@types+react-dom@19.2.0_@types+react@19.2.0__@types+rea_8f1fc703e8391b1f2d2a5b3573822d8f/node_modules/@radix-ui/react-separator
│   │   ├── react-slot -> ../.pnpm/@radix-ui+react-slot@1.2.3_@types+react@19.2.0_react@19.1.0/node_modules/@radix-ui/react-slot
│   │   ├── react-tabs -> ../.pnpm/@radix-ui+react-tabs@1.1.13_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react@1_a09d430d8921a5d7ea8047368f15a47c/node_modules/@radix-ui/react-tabs
│   │   ├── react-toggle -> ../.pnpm/@radix-ui+react-toggle@1.1.10_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react_f2e6a0e94409d5a5f20f5f49c5fc6643/node_modules/@radix-ui/react-toggle
│   │   ├── react-toggle-group -> ../.pnpm/@radix-ui+react-toggle-group@1.1.11_@types+react-dom@19.2.0_@types+react@19.2.0__@types_1df6cc653260bc431b545abc5d9dad43/node_modules/@radix-ui/react-toggle-group
│   │   └── react-tooltip -> ../.pnpm/@radix-ui+react-tooltip@1.2.8_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react_6cfe0a25eacf7a813489e0aa8c8639da/node_modules/@radix-ui/react-tooltip
│   ├── @tabler
│   │   └── icons-react -> ../.pnpm/@tabler+icons-react@3.35.0_react@19.1.0/node_modules/@tabler/icons-react
│   ├── @tailwindcss
│   │   └── postcss -> ../.pnpm/@tailwindcss+postcss@4.1.14/node_modules/@tailwindcss/postcss
│   ├── @tanstack
│   │   └── react-table -> ../.pnpm/@tanstack+react-table@8.21.3_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@tanstack/react-table
│   ├── @types
│   │   ├── node -> ../.pnpm/@types+node@20.19.19/node_modules/@types/node
│   │   ├── react -> ../.pnpm/@types+react@19.2.0/node_modules/@types/react
│   │   └── react-dom -> ../.pnpm/@types+react-dom@19.2.0_@types+react@19.2.0/node_modules/@types/react-dom
│   ├── autoprefixer -> .pnpm/autoprefixer@10.4.21_postcss@8.5.6/node_modules/autoprefixer
│   ├── better-auth -> .pnpm/better-auth@1.3.26_next@15.5.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/better-auth
│   ├── class-variance-authority -> .pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority
│   ├── clsx -> .pnpm/clsx@2.1.1/node_modules/clsx
│   ├── date-fns -> .pnpm/date-fns@4.1.0/node_modules/date-fns
│   ├── dotenv -> .pnpm/dotenv@17.2.3/node_modules/dotenv
│   ├── drizzle-kit -> .pnpm/drizzle-kit@0.31.5/node_modules/drizzle-kit
│   ├── drizzle-orm -> .pnpm/drizzle-orm@0.44.6_@libsql+client@0.15.15_kysely@0.28.7/node_modules/drizzle-orm
│   ├── lucide-react -> .pnpm/lucide-react@0.544.0_react@19.1.0/node_modules/lucide-react
│   ├── next -> .pnpm/next@15.5.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next
│   ├── next-themes -> .pnpm/next-themes@0.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next-themes
│   ├── postcss -> .pnpm/postcss@8.5.6/node_modules/postcss
│   ├── react -> .pnpm/react@19.1.0/node_modules/react
│   ├── react-day-picker -> .pnpm/react-day-picker@9.11.1_react@19.1.0/node_modules/react-day-picker
│   ├── react-dom -> .pnpm/react-dom@19.1.0_react@19.1.0/node_modules/react-dom
│   ├── recharts -> .pnpm/recharts@2.15.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/recharts
│   ├── server-only -> .pnpm/server-only@0.0.1/node_modules/server-only
│   ├── sonner -> .pnpm/sonner@2.0.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/sonner
│   ├── tailwind-merge -> .pnpm/tailwind-merge@3.3.1/node_modules/tailwind-merge
│   ├── tailwindcss -> .pnpm/tailwindcss@4.1.14/node_modules/tailwindcss
│   ├── tsx -> .pnpm/tsx@4.20.6/node_modules/tsx
│   ├── tw-animate-css -> .pnpm/tw-animate-css@1.4.0/node_modules/tw-animate-css
│   ├── typescript -> .pnpm/typescript@5.9.3/node_modules/typescript
│   ├── uuid -> .pnpm/uuid@13.0.0/node_modules/uuid
│   ├── vaul -> .pnpm/vaul@1.1.2_@types+react-dom@19.2.0_@types+react@19.2.0__@types+react@19.2.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/vaul
│   └── zod -> .pnpm/zod@4.1.11/node_modules/zod
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── src
│   ├── actions
│   │   ├── create_ingredients.ts
│   │   ├── create_recipe.ts
│   │   ├── delete_recipe.ts
│   │   ├── get_recipe_ingredients.ts
│   │   ├── get_recipe_steps.ts
│   │   ├── modify_recipe.ts
│   │   └── shoppingListActions.ts
│   ├── app
│   │   ├── calendar
│   │   │   ├── _components
│   │   │   │   └── calendarOverview.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── recipes
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── _components
│   │   │   │   ├── open_create_recipe_button.tsx
│   │   │   │   ├── open_edit_recipe_button.tsx
│   │   │   │   └── recipe_form_dialog_button.tsx
│   │   │   └── page.tsx
│   │   ├── shoppinglist
│   │   │   └── page.tsx
│   │   └── test.tsx
│   ├── components
│   │   ├── AddItemForm.tsx
│   │   ├── AddMealForm.tsx
│   │   ├── IngredientsTable.tsx
│   │   ├── MealPlanner.tsx
│   │   ├── NavigationBar.tsx
│   │   ├── NewRecipePopup.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetailModal.tsx
│   │   ├── RecipeOverview.tsx
│   │   ├── ShoppingItem.tsx
│   │   ├── ShoppingList.tsx
│   │   ├── ingredient_create_dialog.tsx
│   │   └── ui
│   │       ├── DayCard.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── db
│   │   ├── index.ts
│   │   ├── localdb.sqlite
│   │   ├── queries
│   │   │   ├── getCalendarItems.ts
│   │   │   ├── getFoodCategory.ts
│   │   │   ├── getIngredientCategories.ts
│   │   │   ├── getIngredients.ts
│   │   │   ├── getRecipeIngredients.ts
│   │   │   ├── getRecipes.ts
│   │   │   ├── getShoppingList.ts
│   │   │   ├── getUnits.ts
│   │   │   ├── insertIngredienCategory.ts
│   │   │   ├── insertIngredients.ts
│   │   │   ├── insertRecipe.ts
│   │   │   ├── insertRecipeCategory.ts
│   │   │   └── insertSteps.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── hooks
│   │   └── hooks.tsx
│   ├── lib
│   │   ├── auth-client.ts
│   │   ├── auth-server.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── zodSchemas
│       ├── ingredientsForDb.ts
│       ├── ingredientsRecipecard.ts
│       ├── recipe.ts
│       └── step.ts
└── tsconfig.json

77 directories, 85 files
melinaklein@Mac webEngineering % pnpm add -D eslint eslint-config-next prettier eslint-config-prettier eslint-plugin-import


   ╭──────────────────────────────────────────╮
   │                                          │
   │   Update available! 10.18.1 → 10.20.0.   │
   │   Changelog: https://pnpm.io/v/10.20.0   │
   │     To update, run: pnpm add -g pnpm     │
   │                                          │
   ╰──────────────────────────────────────────╯

 WARN  3 deprecated subdependencies found: @esbuild-kit/core-utils@3.3.2, @esbuild-kit/esm-loader@2.6.5, node-domexception@1.0.0
Packages: +293 -3
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
Progress: resolved 677, reused 337, downloaded 214, added 293, done

devDependencies:
+ eslint 9.39.1
+ eslint-config-next 16.0.1
+ eslint-config-prettier 10.1.8
+ eslint-plugin-import 2.32.0
+ prettier 3.6.2

╭ Warning ─────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Ignored build scripts: unrs-resolver.                                      │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯

Done in 5.1s using pnpm v10.18.1
melinaklein@Mac webEngineering % nano .eslintrc.json
melinaklein@Mac webEngineering % # Recipes feature UI (reusable components)
git mv src/app/recipes/_components/open_create_recipe_button.tsx src/features/recipes/ui/OpenCreateRecipeButton.tsx
git mv src/app/recipes/_components/open_edit_recipe_button.tsx   src/features/recipes/ui/OpenEditRecipeButton.tsx
git mv src/app/recipes/_components/recipe_form_dialog_button.tsx src/features/recipes/ui/RecipeFormDialogButton.tsx

# Calendar feature UI
git mv src/app/calendar/_components/calendarOverview.tsx src/features/calendar/ui/CalendarOverview.tsx

# Misplaced test route: make it a real route file or delete if unused
git mv src/app/test.tsx src/app/test/page.tsx

zsh: missing end of string
fatal: renaming 'src/app/recipes/_components/open_create_recipe_button.tsx' failed: No such file or directory
fatal: renaming 'src/app/recipes/_components/open_edit_recipe_button.tsx' failed: No such file or directory
fatal: renaming 'src/app/recipes/_components/recipe_form_dialog_button.tsx' failed: No such file or directory
zsh: command not found: #
fatal: renaming 'src/app/calendar/_components/calendarOverview.tsx' failed: No such file or directory
zsh: command not found: #
fatal: renaming 'src/app/test.tsx' failed: No such file or directory
melinaklein@Mac webEngineering % ls
README.md		next-env.d.ts		pnpm-lock.yaml
_deps.txt		node_modules		postcss.config.mjs
components.json		package-lock.json	src
drizzle.config.ts	package.json		tsconfig.json
melinaklein@Mac webEngineering % >....                                          

# Truly shared widgets (if they are not recipe-only):
# (inspect these; move to features if domain-specific)
git mv src/components/NavigationBar.tsx src/shared/ui/NavigationBar.tsx
git mv src/components/IngredientsTable.tsx src/features/recipes/ui/IngredientsTable.tsx
git mv src/components/NewRecipePopup.tsx src/features/recipes/ui/NewRecipePopup.tsx
git mv src/components/RecipeCard.tsx src/features/recipes/ui/RecipeCard.tsx
git mv src/components/RecipeDetailModal.tsx src/features/recipes/ui/RecipeDetailModal.tsx
git mv src/components/RecipeOverview.tsx src/features/recipes/ui/RecipeOverview.tsx
git mv src/components/AddItemForm.tsx src/features/shopping/ui/AddItemForm.tsx
git mv src/components/ShoppingItem.tsx src/features/shopping/ui/ShoppingItem.tsx 
git mv src/components/ShoppingList.tsx src/features/shopping/ui/ShoppingList.tsx 
git mv src/components/AddMealForm.tsx src/features/calendar/ui/AddMealForm.tsx
git mv src/components/MealPlanner.tsx src/features/calendar/ui/MealPlanner.tsx
git mv src/components/ingredient_create_dialog.tsx src/features/recipes/ui/IngredientCreateDialog.tsx

zsh: parse error near `)'
melinaklein@Mac webEngineering % nano clean-up 
melinaklein@Mac webEngineering % nano clean-ip.sh
melinaklein@Mac webEngineering % c              
c++                cksum              compvalues         ctags
c++-15             clang              config_data        ctf_insert
c++filt            clang++            config_data5.34    cu
c89                clangd             continue           cups-config
c99                clear              coproc             cupsaccept
c_rehash           cmp                coreaudiod         cupsctl
caffeinate         cmpdylib           corelist           cupsd
cal                code               corelist5.34       cupsdisable
calendar           code-tunnel        corepack           cupsenable
cancel             codecctl           cp                 cupsfilter
cap_mkdb           codesign           cpan               cupsreject
captoinfo          codesign_allocate  cpan5.34           cupstestppd
case               col                cpio               curl
cat                colrm              cpp                curl-config
cc                 column             cpp-15             cut
cd                 comm               cpu_profiler.d     cvadmin
certtool           command            cpuctl             cvaffinity
cfprefsd           compadd            cpuwalk.d          cvcp
chat               comparguments      crc32              cvdb
chdir              compcall           crc325.34          cvdbset
checkgid           compctl            creatbyproc.d      cvfsck
chflags            compdescribe       createhomedir      cvfsdb
chfn               compfiles          crlrefresh         cvfsid
chgrp              compgroups         cron               cvgather
chmod              compquote          crontab            cvlabel
chown              compress           csfdiagnose        cvmkdir
chpass             compression_tool   csh                cvmkfile
chroot             compset            csplit             cvmkfs
chsh               comptags           csreq              cvupdatefs
ckksctl            comptry            csrutil            cvversions
melinaklein@Mac webEngineering % clean-ip.sh            
zsh: command not found: clean-ip.sh
melinaklein@Mac webEngineering % ./clean-ip.sh
zsh: permission denied: ./clean-ip.sh
melinaklein@Mac webEngineering % chmod clean-ip.sh 777
chmod: Invalid file mode: clean-ip.sh
melinaklein@Mac webEngineering % nano clean-ip.sh 

  UW PICO 5.09                       File: clean-ip.sh                          

# Recipes feature UI (reusable components)
git mv src/app/recipes/_components/open_create_recipe_button.tsx src/features/r$
git mv src/app/recipes/_components/open_edit_recipe_button.tsx   src/features/r$
git mv src/app/recipes/_components/recipe_form_dialog_button.tsx src/features/r$

# Calendar feature UI
git mv src/app/calendar/_components/calendarOverview.tsx src/features/calendar/$

# Misplaced test route: make it a real route file or delete if unused
git mv src/app/test.tsx src/app/test/page.tsx
# Generic primitives (global reuse) -> shared/ui
git mv src/components/ui src/shared/ui

# Truly shared widgets (if they are not recipe-only):
# (inspect these; move to features if domain-specific)
git mv src/components/NavigationBar.tsx src/shared/ui/NavigationBar.tsx
git mv src/components/IngredientsTable.tsx src/features/recipes/ui/IngredientsT$
git mv src/components/NewRecipePopup.tsx src/features/recipes/ui/NewRecipePopup$
git mv src/components/RecipeCard.tsx src/features/recipes/ui/RecipeCard.tsx

^G Get Help  ^O WriteOut  ^R Read File ^Y Prev Pg   ^K Cut Text  ^C Cur Pos   
^X Exit      ^J Justify   ^W Where is  ^V Next Pg   ^U UnCut Text^T To Spell  
# Recipes feature UI (reusable components)
git mv src/app/recipes/_components/open_create_recipe_button.tsx src/features/recipes/ui/OpenCreateRecipeButton.tsx
git mv src/app/recipes/_components/open_edit_recipe_button.tsx   src/features/recipes/ui/OpenEditRecipeButton.tsx
git mv src/app/recipes/_components/recipe_form_dialog_button.tsx src/features/recipes/ui/RecipeFormDialogButton.tsx

# Calendar feature UI
git mv src/app/calendar/_components/calendarOverview.tsx src/features/calendar/ui/CalendarOverview.tsx

# Misplaced test route: make it a real route file or delete if unused
git mv src/app/test.tsx src/app/test/page.tsx
# Generic primitives (global reuse) -> shared/ui
git mv src/components/ui src/shared/ui

# Truly shared widgets (if they are not recipe-only):
# (inspect these; move to features if domain-specific)
git mv src/components/NavigationBar.tsx src/shared/ui/NavigationBar.tsx
git mv src/components/IngredientsTable.tsx src/features/recipes/ui/IngredientsTable.tsx
git mv src/components/NewRecipePopup.tsx src/features/recipes/ui/NewRecipePopup.tsx
git mv src/components/RecipeCard.tsx src/features/recipes/ui/RecipeCard.tsx
git mv src/components/RecipeDetailModal.tsx src/features/recipes/ui/RecipeDetailModal.tsx
git mv src/components/RecipeOverview.tsx src/features/recipes/ui/RecipeOverview.tsx
git mv src/components/AddItemForm.tsx src/features/shopping/ui/AddItemForm.tsx
git mv src/components/ShoppingItem.tsx src/features/shopping/ui/ShoppingItem.tsx
git mv src/components/ShoppingList.tsx src/features/shopping/ui/ShoppingList.tsx
git mv src/components/AddMealForm.tsx src/features/calendar/ui/AddMealForm.tsx
git mv src/components/MealPlanner.tsx src/features/calendar/ui/MealPlanner.tsx
git mv src/components/ingredient_create_dialog.tsx src/features/recipes/ui/IngredientCreateDialog.tsx
git mv src/actions/create_ingredients.ts      src/features/recipes/actions/createIngredients.ts
git mv src/actions/create_recipe.ts           src/features/recipes/actions/createRecipe.ts
git mv src/actions/delete_recipe.ts           src/features/recipes/actions/deleteRecipe.ts
git mv src/actions/get_recipe_ingredients.ts  src/features/recipes/actions/getRecipeIngredients.ts
git mv src/actions/get_recipe_steps.ts        src/features/recipes/actions/getRecipeSteps.ts
git mv src/actions/modify_recipe.ts           src/features/recipes/actions/modifyRecipe.ts
git mv src/actions/shoppingListActions.ts     src/features/shopping/actions/shoppingListActions.ts
mkdir -p src/server/db/queries
git mv src/db/index.ts                src/server/db/index.ts
git mv src/db/schema.ts               src/server/db/schema.ts
git mv src/db/seed.ts                 src/server/db/seed.ts
git mv src/db/queries/*               src/server/db/queries/
mkdir -p src/shared/validation
git mv src/zodSchemas/* src/shared/validation/
mkdir -p src/shared/hooks
git mv src/hooks/hooks.tsx src/shared/hooks/index.ts
mkdir -p src/auth
git mv src/lib/auth-client.ts src/auth/auth-client.ts
git mv src/lib/auth-server.ts src/auth/auth-server.ts
git mv src/lib/auth.ts        src/auth/auth.ts

# keep utils in shared/lib
mkdir -p src/shared/lib
git mv src/lib/utils.ts src/shared/lib/utils.ts

