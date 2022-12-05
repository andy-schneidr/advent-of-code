module Day04
  class << self
    def part_one(input)
      count = 0
      input.each do |line|
        ranges = line.split(",")
        range0 = parseRange(ranges[0])
        range1 = parseRange(ranges[1])

        if (rangeContains(range0, range1) || rangeContains(range1, range0))
          count += 1
        end
      end
      return count
    end

    def part_two(input)
      count = 0
      input.each do |line|
        ranges = line.split(",")
        range0 = parseRange(ranges[0])
        range1 = parseRange(ranges[1])

        if rangeOverlaps(range0, range1) || rangeOverlaps(range1, range0)
          count += 1
        end
      end
      return count
    end

    def parseRange(str)
      nums = str.split("-")
      return [nums[0].to_i, nums[1].to_i]
    end


    #.23456...  2-6
    #...45678.  4-8
    def rangeOverlaps(r0, r1)
      lo = 0
      hi = 1
      return r1[lo] >= r0[lo] && r1[lo] <= r0[hi]
    end

    # does range 0 contain range 1?
    # .2345678.  2-8
    # ..34567..  3-7

    def rangeContains(r0, r1)
      lo = 0
      hi = 1
      return r1[lo] >= r0[lo] && r1[hi] <= r0[hi]
    end
  end
end

lines = File.readlines("examples/04/04.txt")
puts Day04.part_one(lines)
puts Day04.part_two(lines)
lines = File.readlines("inputs/04.txt")
puts Day04.part_one(lines)
puts Day04.part_two(lines)
