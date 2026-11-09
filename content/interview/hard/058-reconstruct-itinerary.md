---
title: Reconstruct Itinerary
tier: hard
order: 58
leetcode: 332
url: https://leetcode.com/problems/reconstruct-itinerary/
companies: [Google, Amazon, Meta]
topic: Graph
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/09-graphs]
---

You get a list of flight tickets, each one a pair [from, to] of airport codes. Every code is three capital letters. The list has between 1 and 300 tickets. Each ticket is used exactly once, and the trip always starts at JFK. A valid trip exists for every input you get.

Return the trip as a list of airport codes, starting with JFK and ending after the last ticket. Each ticket is one step, so the list has one more code than the number of tickets. If several trips use every ticket, return the one that is smallest when the codes are compared one by one from the start. For example, JFK, AAA, JFK, BBB beats JFK, BBB, JFK, AAA.

Think of the tickets as edges of a directed graph. A trip that uses every edge once is an Euler path. Plain walking from JFK can get stuck early, so the walk needs a way to backtrack when it reaches an airport with no tickets left.

::exercise
---
id: iv-hard-058
prompt: Write a function reconstruct_itinerary(tickets) that returns the smallest trip, as a list of airport codes starting at JFK, that uses every ticket once.
starter: |
  # write your code below
  def reconstruct_itinerary(tickets):
      pass
hints:
  - Store each airport's outgoing destinations in order, smallest first, and take the smallest one each time you move on.
  - When you reach an airport with no tickets left, add it to the front of the answer only after every route from it is spent.
tests:
  - check: assert reconstruct_itinerary([["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]) == ["JFK", "MUC", "LHR", "SFO", "SJC"]
  - check: assert reconstruct_itinerary([["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]) == ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]
  - check: assert reconstruct_itinerary([["JFK", "KUL"]]) == ["JFK", "KUL"]
  - check: assert reconstruct_itinerary([["JFK", "AAA"], ["AAA", "JFK"]]) == ["JFK", "AAA", "JFK"]
  - check: assert reconstruct_itinerary([["JFK", "AAA"], ["JFK", "BBB"], ["BBB", "JFK"]]) == ["JFK", "BBB", "JFK", "AAA"]
  - check: assert reconstruct_itinerary([["JFK", "AAA"], ["AAA", "JFK"], ["JFK", "BBB"], ["JFK", "CCC"], ["CCC", "JFK"]]) == ["JFK", "AAA", "JFK", "CCC", "JFK", "BBB"]
  - check: assert reconstruct_itinerary([["JFK", "AAA"], ["JFK", "AAA"], ["AAA", "JFK"]]) == ["JFK", "AAA", "JFK", "AAA"]
  - check: assert reconstruct_itinerary([["AAA", "AAA"], ["JFK", "AAA"]]) == ["JFK", "AAA", "AAA"]
  - check: assert reconstruct_itinerary([["JFK", "ZZZ"], ["JFK", "AAA"], ["AAA", "JFK"]]) == ["JFK", "AAA", "JFK", "ZZZ"]
  - check: assert reconstruct_itinerary([["JFK", "BBB"], ["BBB", "CCC"], ["CCC", "BBB"], ["BBB", "JFK"], ["JFK", "CCC"]]) == ["JFK", "BBB", "CCC", "BBB", "JFK", "CCC"]
# why: the 300 tickets are consecutive pairs of a walk from JFK through 22 real airports, so a trip exists by construction; 31160023 is the checksum of the trip from a backtracking search that tries tickets in sorted order and keeps the first complete trip (run offline, not the solution)
big: assert (codes := "ATL BOS CDG DEN DFW DXB EWR FRA GRU HKG HND JFK LAX LHR MAD MIA MUC NRT ORD SFO SIN YYZ".split()) and (r := ["JFK"] + [codes[(k * k + k + k ** 3 % 97) % 22] for k in range(1, 301)]) and sum(i * ord(c) for i, c in enumerate("".join(reconstruct_itinerary([[r[i], r[i + 1]] for i in range(300)])))) == 31160023
solution: |
  def reconstruct_itinerary(tickets):
      graph = {}
      for a, b in sorted(tickets, reverse=True):
          graph.setdefault(a, []).append(b)
      stack = ["JFK"]
      trip = []
      while stack:
          top = stack[-1]
          if graph.get(top):
              stack.append(graph[top].pop())
          else:
              trip.append(stack.pop())
      return trip[::-1]
brute: |
  def reconstruct_itinerary(tickets):
      ordered = sorted(tickets)
      used = [False] * len(ordered)
      def walk(place, path):
          if len(path) == len(ordered) + 1:
              return path
          for i, (a, b) in enumerate(ordered):
              if not used[i] and a == place:
                  used[i] = True
                  found = walk(b, path + [b])
                  used[i] = False
                  if found:
                      return found
          return None
      return walk("JFK", ["JFK"])
random:
  call: reconstruct_itinerary
  gen: |
    def gen(rng, size):
        count = min(max(size, 1), 8)
        pool = ["JFK", "AAA", "BBB", "CCC"]
        route = ["JFK"] + [rng.choice(pool) for _ in range(count)]
        tickets = [[route[k], route[k + 1]] for k in range(count)]
        rng.shuffle(tickets)
        return (tickets,)
slow:
  - |
    from itertools import permutations
    def reconstruct_itinerary(tickets):
        best = None
        for order in permutations(sorted(tickets)):
            trip = ["JFK"]
            for a, b in order:
                if a != trip[-1]:
                    break
                trip.append(b)
            else:
                if best is None or trip < best:
                    best = trip
        return best
wrong:
  - |
    def reconstruct_itinerary(tickets):
        graph = {}
        for a, b in sorted(tickets):
            graph.setdefault(a, []).append(b)
        stack = ["JFK"]
        trip = []
        while stack:
            top = stack[-1]
            if graph.get(top):
                stack.append(graph[top].pop())
            else:
                trip.append(stack.pop())
        return trip[::-1]
  - |
    def reconstruct_itinerary(tickets):
        graph = {}
        for a, b in sorted(tickets, reverse=True):
            graph.setdefault(a, []).append(b)
        trip = ["JFK"]
        while graph.get(trip[-1]):
            trip.append(graph[trip[-1]].pop())
        return trip
  - |
    def reconstruct_itinerary(tickets):
        graph = {}
        for a, b in sorted(tickets, reverse=True):
            graph.setdefault(a, []).append(b)
        stack = ["JFK"]
        trip = []
        while stack:
            top = stack[-1]
            if graph.get(top):
                stack.append(graph[top].pop())
            else:
                trip.append(stack.pop())
        return trip
equivalent: []
---
::
