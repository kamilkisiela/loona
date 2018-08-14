**Example**

```ts
@Mutation(Goal)
@Patch(game)
updateGame(state, {team}) {
    state.game[`team${team}Score`] += 1;
}
```

**Issue**

This will:

1.  call @Patch
1.  overwrite descriptor
1.  call @Mutation
1.  set metadata

The issue here is that @Patch won't be able to check if Mutation was set based on metadata

**Solution**

Without changing the example:

1.  call @Patch
1.  overwrite descriptor
1.  call @Mutation
1.  set metadata
1.  call descriptor's value
1.  what kind of patch is that
1.  call patch
