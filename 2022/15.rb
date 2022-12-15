require "set"

module Day15
  class << self
    def part_one(input)
      row = 2000000
      sensor_xy_beacon_xys = parse(input)
      sensors = []
      sensor_xy_beacon_xys.each do |sensor_xy_beacon_xy|
        sensors.append(Sensor.new(
          sensor_xy_beacon_xy[0..1],
          sensor_xy_beacon_xy[2..4]
        ))
        # puts sensors.last.location_xy.to_s
        # puts sensors.last.closest_beacon_xy.to_s
      end

      unusable_positions(row, sensors)
    end

    def part_two(input)
      row = 2000000
      sensor_xy_beacon_xys = parse(input)
      sensors = []
      sensor_xy_beacon_xys.each do |sensor_xy_beacon_xy|
        sensors.append(Sensor.new(
          sensor_xy_beacon_xy[0..1],
          sensor_xy_beacon_xy[2..4]
        ))
        # puts sensors.last.location_xy.to_s
        # puts sensors.last.closest_beacon_xy.to_s
      end

      min = 0
      max = 4000000
      scan_for_usable_positions(min, max, sensors)
    end

    def parse(input)
      sensor_xy_beacon_xy = []
      input.each do |line|
        sensor_xy_beacon_xy.append(line.scan(/[-\d]+/).map(&:to_i))
      end
      return sensor_xy_beacon_xy
    end

    def unusable_positions(row, sensors)
      x = 0
      y = 1
      beacons_on_row = Set.new
      # unusable_ranges is only measuring the X axis
      unusable_ranges = []

      sensors.each do |sensor|
        if sensor.closest_beacon_xy[y] == row
          beacons_on_row << sensor.closest_beacon_xy[x]
        end
        distance_to_row = (row - sensor.location_xy[y]).abs
        remaining_distance = sensor.manhattan_dist - distance_to_row
        if remaining_distance > 0
          # puts "using sensor at #{sensor.location_xy.to_s} w mh dist: #{sensor.manhattan_dist}"
          unusable_ranges.append([
            sensor.location_xy[x] - remaining_distance,
            sensor.location_xy[x] + remaining_distance,
          ])
          # puts "unusable range: #{unusable_ranges.last.to_s}"
        end
      end

      unusable_ranges = combine_ranges(unusable_ranges)
      unusable_locations = sum_ranges(unusable_ranges)
      # puts beacons_on_row
      return unusable_locations - beacons_on_row.length
    end

    def scan_for_usable_positions(min, max, sensors)
      x = 0
      y = 1
      # beacons_on_row = Set.new
      # unusable_ranges is only measuring the X axis
      min.step(max, 1) { |row|
        unusable_ranges = []
        sensors.each do |sensor|
          # if sensor.closest_beacon_xy[y] == row
          #   beacons_on_row << sensor.closest_beacon_xy[x]
          # end
          distance_to_row = (row - sensor.location_xy[y]).abs
          remaining_distance = sensor.manhattan_dist - distance_to_row
          if remaining_distance > 0
            # puts "using sensor at #{sensor.location_xy.to_s} w mh dist: #{sensor.manhattan_dist}"
            unusable_ranges.append([
              sensor.location_xy[x] - remaining_distance,
              sensor.location_xy[x] + remaining_distance,
            ])
            # puts "unusable range: #{unusable_ranges.last.to_s}"
          end
        end

        unusable_ranges = combine_ranges(unusable_ranges)
        if unusable_ranges.length > 1
          puts "ROW: #{row}"
          puts "might be in here: #{unusable_ranges.to_s}"
          return ((unusable_ranges[0][1] + 1) * 4000000) + row
          break
        end
      }
      # puts beacons_on_row
      # return unusable_locations - beacons_on_row.length

    end

    def combine_ranges(ranges)
      ranges.sort!
      result = []
      current = ranges[0]
      # puts "Ranges (uncombined): "
      # ranges.each do |range|
      #   puts range.to_s
      # end

      1.step(ranges.length - 1, 1) { |i|
        range = ranges[i]
        if current[1] >= range[0]
          if range[1] > current[1]
            current[1] = range[1]
          end
        else
          result.append(current)
          current = range
        end
      }
      result.append(current)

      # puts "Ranges (combined): "
      # result.each do |range|
      #   puts range.to_s
      # end
    end

    def sum_ranges(ranges)
      sum = 0
      ranges.each { |range| sum += (range[1] - range[0] + 1) }
      sum
    end
  end

  class Sensor
    attr_accessor :closest_beacon_xy
    attr_accessor :location_xy
    attr_accessor :manhattan_dist

    def initialize(sensor_xy, beacon_xy)
      @location_xy = sensor_xy
      @closest_beacon_xy = beacon_xy
      @manhattan_dist = (sensor_xy[0] - beacon_xy[0]).abs +
                        (sensor_xy[1] - beacon_xy[1]).abs
    end
  end
end

lines = File.readlines("examples/15/15.txt")
# puts Day15.part_one(lines)
# puts Day15.part_two(lines)
lines = File.readlines("inputs/15.txt")
# puts Day15.part_one(lines)
# puts Day15.part_two(lines)
