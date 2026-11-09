---
title: Car Pooling
tier: medium
order: 56
leetcode: 1094
url: https://leetcode.com/problems/car-pooling/
companies: [Meta, Google, Amazon]
topic: Sorting
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

A car has a fixed number of seats, given as capacity. You get a list of trips, and each trip is [passengers, start, end]: a group of passengers gets in at location start and gets out at location end. Locations are whole numbers from 0 to 1000, and start is always less than end. The list has between 1 and 100000 trips, each with 1 to 9 passengers, and capacity is from 0 to 10000 passengers. A group that gets out at a location leaves before any group that gets in at the same location. Return True if the car can carry every group from start to end without ever holding more passengers than its capacity, and False otherwise.

Each trip adds passengers at its start and removes them at its end. Walk the locations in order, keeping a running total, and check the total after each change.

::exercise
---
id: iv-medium-056
prompt: Write a function car_pooling(trips, capacity) that returns True if the car never carries more passengers than its capacity, and False otherwise.
starter: |
  # write your code below
  def car_pooling(trips, capacity):
      pass
hints:
  - Keep a list of changes, with the passenger count added at each start and taken away at each end.
  - Passengers leave at end, so a group should not count at its end location.
tests:
  - check: assert car_pooling([[2, 1, 5], [3, 3, 7]], 4) == False
  - check: assert car_pooling([[2, 1, 5], [3, 3, 7]], 5) == True
  - check: assert car_pooling([[2, 1, 5], [3, 5, 7]], 3) == True
  - check: assert car_pooling([[2, 1, 5], [3, 5, 7]], 2) == False
  - check: assert car_pooling([[1, 0, 1]], 1) == True
  - check: assert car_pooling([[1, 0, 1]], 0) == False
  - check: assert car_pooling([[9, 0, 1000]], 9) == True
  - check: assert car_pooling([[1, 0, 2], [1, 1, 3], [1, 2, 4]], 2) == True
  - check: assert car_pooling([[1, 0, 2], [1, 1, 3], [1, 2, 4]], 1) == False
big: 'assert (lambda t: car_pooling(t, 6048) == True and car_pooling(t, 6047) == False)([[(i * 7) % 9 + 1, (i * 37) % 1000, min(1000, (i * 37) % 1000 + 1 + (i * 11) % 20)] for i in range(100000)])'
solution: |
  def car_pooling(trips, capacity):
      change = [0] * 1001
      for passengers, start, end in trips:
          change[start] += passengers
          change[end] -= passengers
      load = 0
      for delta in change:
          load += delta
          if load > capacity:
              return False
      return True
brute: |
  def car_pooling(trips, capacity):
      for spot in range(1001):
          load = 0
          for passengers, start, end in trips:
              if start <= spot < end:
                  load += passengers
          if load > capacity:
              return False
      return True
random:
  call: car_pooling
  gen: |
    def gen(rng, size):
        trips = []
        for _ in range(max(size, 1)):
            base = rng.choice([0, 500, 993])
            start = base + rng.randint(0, 6)
            end = rng.randint(start + 1, base + 7)
            trips.append([rng.randint(1, 3), start, end])
        return (trips, rng.randint(0, 6))
slow:
  - |
    def car_pooling(trips, capacity):
        for spot in range(1001):
            load = 0
            for passengers, start, end in trips:
                if start <= spot < end:
                    load += passengers
            if load > capacity:
                return False
        return True
  - |
    def car_pooling(trips, capacity):
        return max(sum(p for p, s, e in trips if s <= spot < e) for spot in range(1001)) <= capacity
wrong:
  - |
    def car_pooling(trips, capacity):
        change = [0] * 1002
        for passengers, start, end in trips:
            change[start] += passengers
            change[end + 1] -= passengers
        load = 0
        for delta in change:
            load += delta
            if load > capacity:
                return False
        return True
  - |
    def car_pooling(trips, capacity):
        change = [0] * 1002
        for passengers, start, end in trips:
            change[start] += passengers
            change[end] -= passengers
        load = 0
        for delta in change:
            load += delta
            if load >= capacity:
                return False
        return True
  - |
    def car_pooling(trips, capacity):
        events = [(start, passengers) for passengers, start, end in trips]
        events += [(end, -passengers) for passengers, start, end in trips]
        load = 0
        for spot, delta in sorted(events, key=lambda event: event[0]):
            load += delta
            if load > capacity:
                return False
        return True
equivalent:
  - "change = [0] * 1002"   # why: the largest index used is 1000, so one extra zero cell at the end adds a zero delta and the running total never changes
---
::
