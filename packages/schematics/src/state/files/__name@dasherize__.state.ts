import { State, Mutation, Context } from '@loona/angular';

@State({
  <% if (received.schema) { %>
    typeDefs: `
      <%= received.schema %>
    `
  <% } %>
})
export class <%= classify(name) %>State {
  <% if (received.mutations) { %>
    <% received.mutations.forEach((name) => { %>
    @Mutation('<%= name %>')
    <%= name %>(_, args, context: Context) {}
    <% }) %>
  <% } %>
}
